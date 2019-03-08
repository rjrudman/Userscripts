import { ReputationEvent } from './Types/ReputationEvent';
import { VoteOppositePairs, HasOppositePair, IsReversableType, IsReversalType } from './EventTypes';

function NetChange(events: ReputationEvent[]) {
    return events.reduce((l, r) => l + r.reputation_change, 0);
}

interface BucketData<T> {
    IsBucketed: boolean;
    BucketIndex: number;
    BucketSize: number;
    Bucket: EventWithBucketData<T>[];

    Cancelled: boolean;
    OriginalEvent: ReputationEvent;
}

export type EventWithBucketData<T> = BucketData<T> & T;

function BucketStart(events: ReputationEvent[]) {
    return Math.min(...events.map(e => e.creation_date));
}

function BucketEnd(events: ReputationEvent[]) {
    return Math.max(...events.map(e => e.creation_date));
}

export function ProcessBuckets<T extends ReputationEvent>(payload: T[], voteGapSeconds: number, minBucketSize: number): EventWithBucketData<T>[] {
    const buckets = payload.map(p => [{
        ...p,
        IsBucketed: false,
        BucketIndex: 0,
        BucketSize: 0,
        Bucket: [] as EventWithBucketData<T>[],

        Cancelled: false,
        OriginalEvent: p
    }]);
    expandBuckets(buckets, voteGapSeconds);

    let runningBucketIndex = 0;
    buckets.sort((left, right) => BucketStart(left) - BucketStart(right));
    const flattenedItems = buckets
        .map(b => {
            const isBucketed = b.filter(bb => !bb.Cancelled).length >= minBucketSize;
            const bucketSize = b.filter(bb => !bb.Cancelled).length;
            const bucketIndex = isBucketed ? runningBucketIndex++ : -1;
            const bucketItems = b.map(e => ({
                ...e,
                IsBucketed: isBucketed,
                BucketIndex: bucketIndex,
                BucketSize: bucketSize
            }));
            for (const bucketItem of bucketItems) {
                bucketItem.Bucket = bucketItems;
            }
            return bucketItems;
        })
        .reduce((left, right) => left.concat(right), []);

    flattenedItems.sort((left, right) => left.creation_date - right.creation_date);
    return flattenedItems;
}

function expandBuckets<T extends ReputationEvent>(buckets: EventWithBucketData<T>[][], voteGapSeconds: number) {
    let hasChange = false;
    for (const bucket of buckets) {
        const bucketsAfter = buckets.filter(b =>
            b !== bucket
            &&
            (
                (BucketStart(b) >= BucketStart(bucket) && BucketStart(b) - BucketEnd(bucket) < voteGapSeconds)
                || (BucketStart(bucket) >= BucketStart(b) && BucketStart(bucket) - BucketEnd(b) < voteGapSeconds)
            )
        );
        bucketsAfter.sort((left, right) => BucketStart(left) - BucketStart(right));
        for (const bucketAfter of bucketsAfter) {
            for (const event of bucketAfter) {
                if (CanMergeToBucket(bucket, bucketAfter, event)) {
                    MergeToBucket(bucket, bucketAfter, event);
                    hasChange = true;
                }
            }
        }
    }
    if (hasChange) {
        expandBuckets(buckets, voteGapSeconds);
        return;
    }
}

function CanMergeToBucket<T extends ReputationEvent>(targetBucket: EventWithBucketData<T>[], sourceBucket: EventWithBucketData<T>[], event: EventWithBucketData<T>) {
    if (!IsReversableType(event.reputation_history_type)
        && !IsReversalType(event.reputation_history_type)
        && !HasOppositePair(event.reputation_history_type)
    ) {
        return false;
    }

    if (HasOppositePair(event.reputation_history_type)) {
        const oppositeVote = VoteOppositePairs[event.reputation_history_type];
        if (targetBucket.some(e =>
            oppositeVote === e.reputation_history_type
            && event.post_id === e.post_id
            && !e.Cancelled
        )) {
            return true;
        }
    }

    // Two votes on the same post can't be from the same account
    if (targetBucket.some(e =>
        e.post_id === event.post_id
        && e.reputation_history_type === event.reputation_history_type
        && !e.Cancelled)) {
        return false;
    }

    const targetNetChange = NetChange(targetBucket);
    if (event.reputation_change >= 0 && targetNetChange < 0) {
        return false;
    }
    if (event.reputation_change < 0 && targetNetChange >= 0) {
        return false;
    }
    if (targetBucket.length < sourceBucket.length) {
        return false;
    }

    return true;
}

function MergeToBucket<T extends ReputationEvent>(targetBucket: EventWithBucketData<T>[], sourceBucket: EventWithBucketData<T>[], event: EventWithBucketData<T>) {
    if (HasOppositePair(event.reputation_history_type)) {
        const oppositeVote = VoteOppositePairs[event.reputation_history_type];
        const matchedEvents = targetBucket.filter(e =>
            oppositeVote === e.reputation_history_type
            && event.post_id === e.post_id
            && !e.Cancelled);
        if (matchedEvents.length) {
            matchedEvents[0].Cancelled = true;
            event.Cancelled = true;
        }
    }

    targetBucket.unshift(event);
    sourceBucket.splice(sourceBucket.indexOf(event), 1);
}
