import { ReputationEvent } from 'Types/ReputationEvent';
import { ProcessBuckets, EventWithBucketData } from './EventGrouper';
import { FindEventReversals, EventWithReversalData } from './EventReversalPairer';

export function ProcessEvents(events: ReputationEvent[],
    minBucketSize: number = 3,
    duration: number = 30000) {
    const groupedEvents = ProcessBuckets(events, duration, minBucketSize);
    const pairedEvents = FindEventReversals(groupedEvents.filter(ge => ge.BucketSize >= minBucketSize));

    const unpaired = groupedEvents.filter(ge => ge.BucketSize < minBucketSize);
    const entireSet = pairedEvents.concat(unpaired
        .map(e => ({
            ...e,
            Reversed: [] as EventWithReversalData<EventWithBucketData<ReputationEvent>>[],
            ReversedBy: [] as EventWithReversalData<EventWithBucketData<ReputationEvent>>[],
            Pairs: 0,
            OriginalEvent: e.OriginalEvent || e
        })));

    entireSet.sort((left, right) => left.creation_date - right.creation_date);
    return entireSet;
}
