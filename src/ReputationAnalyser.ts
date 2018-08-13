import { ReputationEvent } from 'ReptuationApiResponse';

export type ReputationEventDetails = ReputationEvent & {
    bucket: ReputationEventDetails[];
    firstInBucket?: boolean;
    canIgnore?: boolean; // For example, upvote/unupvote at the same time
};

const groupableEventTypes = ['post_upvoted', 'user_deleted', 'post_unupvoted', 'vote_fraud_reversal'];

export function SortItems(items: ReputationEvent[]) {
    items.sort((a, b) => {
        const dateDiff = b.creation_date - a.creation_date;
        if (dateDiff !== 0) {
            return dateDiff;
        }
        const postDiff = a.post_id - b.post_id;
        if (postDiff !== 0) {
            return postDiff;
        }

        const reputationType = a.reputation_history_type.localeCompare(b.reputation_history_type);
        if (reputationType !== 0) {
            return reputationType;
        }

        return a.reputation_change - b.reputation_change;
    });
}

export function ProcessItems(items: ReputationEvent[], secondsGap: number): ReputationEventDetails[][] {
    const buckets: ReputationEventDetails[][] = [];
    SortItems(items);

    items.forEach(item => {
        if (groupableEventTypes.indexOf(item.reputation_history_type) >= 0) {
            // Find which bucket to put it in
            let matchingBucket = buckets.find(bucket => {
                // If we can't find any events in the bucket which are within our threshold, the bucket isn't valid
                if (!bucket.find(event => (event.creation_date - item.creation_date) < secondsGap)) {
                    return false;
                }

                if (item.reputation_history_type === 'vote_fraud_reversal') {
                    // Reversals won't affect the same post twice
                    if (bucket.find(event => event.post_id === item.post_id)) {
                        return false;
                    }
                }

                if (item.reputation_history_type === 'post_upvoted') {
                    const previouslyUpvoted = bucket.filter(b => b.post_id === item.post_id && b.reputation_history_type === 'post_upvoted').length;
                    const previouslyUnupvoted = bucket.filter(b => b.post_id === item.post_id && b.reputation_history_type === 'post_unupvoted').length;
                    if (previouslyUpvoted - previouslyUnupvoted > 0) {
                        return false;
                    }
                }

                return true;
            });

            const reputationEventDetails = item as ReputationEventDetails;
            if (!matchingBucket) {
                matchingBucket = [];
                buckets.push(matchingBucket);
                reputationEventDetails.firstInBucket = true;
            }

            if (item.reputation_history_type === 'post_upvoted') {
                const unupvote = matchingBucket.find(b =>
                    b.post_id === item.post_id
                    && b.reputation_history_type === 'post_unupvoted'
                    && b.creation_date >= item.creation_date
                    && !b.canIgnore
                );

                if (unupvote) {
                    unupvote.canIgnore = true;
                    reputationEventDetails.canIgnore = true;
                }
            }

            const typedBucket = matchingBucket as ReputationEventDetails[];
            reputationEventDetails.bucket = typedBucket;
            typedBucket.push(reputationEventDetails);
        }
    });

    return buckets;
}
