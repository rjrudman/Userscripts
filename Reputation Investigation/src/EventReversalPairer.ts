import { ReputationEvent } from './Types/ReputationEvent';
import { IsReversableType, GetReversalTypes, IsReversalType } from './EventTypes';

interface ReversalData<T> {
    Reversed: EventWithReversalData<T>[];
    ReversedBy: EventWithReversalData<T>[];
    Pairs: number;
    OriginalEvent: ReputationEvent;

    Cancelled: boolean;
}

export type EventWithReversalData<T> = ReversalData<T> & T;

export function FindEventReversals<T extends ReputationEvent>(events: T[]): EventWithReversalData<T>[] {
    const processedPairs = ProcessEventPairing(events);
    ReducePairs(processedPairs);
    UpdatePairCount(processedPairs);
    return processedPairs;
}

function UpdatePairCount<T extends ReputationEvent>(events: EventWithReversalData<T>[]) {
    const reversals = events.filter(e => IsReversalType(e.reputation_history_type));
    for (const reversal of reversals) {
        for (const reversedEvent of reversal.Reversed) {
            reversedEvent.Pairs = reversal.Reversed.length - 1;
        }
        reversal.Pairs = 0;
    }
}

function ReducePairs<T extends ReputationEvent>(events: EventWithReversalData<T>[]) {
    let hasChange = false;
    const reversals = events.filter(e => IsReversalType(e.reputation_history_type));
    for (const reversal of reversals) {
        if (reversal.Reversed.length === 1) {
            // It only reversed one single event.
            // Therefore, we can get that event and remove it from other reversals
            const reversedEvent = reversal.Reversed[0];
            const otherReversals = reversals.filter(r => r !== reversal && r.Reversed.indexOf(reversedEvent) >= 0);
            // It only reversed this event
            reversedEvent.ReversedBy = [reversal];
            for (const otherReversal of otherReversals) {
                otherReversal.Reversed.splice(otherReversal.Reversed.indexOf(reversedEvent), 1);
                hasChange = true;
            }
        }
    }

    if (hasChange) {
        ReducePairs(events);
    }
}

function ProcessEventPairing<T extends (ReputationEvent & { OriginalEvent?: T, Cancelled?: boolean })>(events: T[]): EventWithReversalData<T>[] {
    const eventsWithMetaData = events.map(e => ({
        ...e,
        Reversed: [] as EventWithReversalData<T>[],
        ReversedBy: [] as EventWithReversalData<T>[],
        Pairs: 0,
        OriginalEvent: e.OriginalEvent || e,
        Cancelled: e.Cancelled || false
    }));
    const eventsByPostId = (postId: number) => eventsWithMetaData.filter(f => f.post_id === postId);
    for (const event of eventsWithMetaData) {
        const otherEventsForPost = eventsByPostId(event.post_id).filter(e => e !== event);
        const matchingFutureEvents = otherEventsForPost.filter(e => e.creation_date > event.creation_date);

        if (IsReversableType(event.reputation_history_type)) {
            if (!event.Cancelled) {
                const reversalTypes = GetReversalTypes(event.reputation_history_type);
                const reversals = matchingFutureEvents.filter(m =>
                    !!reversalTypes.find(reversalType => reversalType === m.reputation_history_type)
                    &&
                    (m.reputation_change === -1 * event.reputation_change
                        || m.reputation_change === 0
                        || event.reputation_change === 0
                    )
                );

                for (const reversal of reversals) {
                    if (!reversal.ReversedBy) {
                        reversal.ReversedBy = [];
                    }
                    reversal.Reversed.push(event);
                }

                event.ReversedBy = reversals;
            }
        }
    }
    return eventsWithMetaData;
}
