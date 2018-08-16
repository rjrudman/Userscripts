import { ReputationEvent } from './ReptuationApiResponse';

export type ReputationEventDetails = ReputationEvent & {
    bucket: ReputationEventDetails[];
    vote_id: number;
    firstInBucket?: boolean;
    canIgnore?: boolean; // For example, upvote/unupvote at the same time
};

const groupableEventTypes = [
    'post_upvoted', 'post_unupvoted',
    'post_downvoted', 'post_undownvoted',
    'asker_unaccept_answer', 'asker_accepts_answer',
    'user_deleted', 'vote_fraud_reversal',
];

function SortItems(items: ReputationEvent[]) {
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

export function ProcessIntoBuckets(items: ReputationEvent[], secondsGap: number): ReputationEventDetails[][] {
    const buckets: ReputationEventDetails[][] = [];
    SortItems(items);
    let i = 1;
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
                    // Except for unaccepts, in which case we can tell the difference due to the reputation amount
                    if (bucket.find(event => event.reputation_change === item.reputation_change && event.post_id === item.post_id)) {
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

            const reversalPairs = [
                ['post_upvoted', 'post_unupvoted'],
                ['post_unupvoted', 'post_upvoted'],
                ['post_downvoted', 'post_undownvoted'],
                ['post_undownvoted', 'post_downvoted'],
                ['asker_accepts_answer', 'asker_unaccept_answer'],
                ['asker_unaccept_answer', 'asker_accepts_answer']
            ];

            // When we see an upvote, check if there's an unupvote that happened afterwards for the same post
            // If there were, we strikethrough each event.
            // Since we only check the same bucket, we won't be striking out unrelated votes (usually)
            // Same goes for in reverse, and downvote/undownvote pairs
            reversalPairs.forEach(pair => {
                if (item.reputation_history_type === pair[0]) {
                    const unupvote = (matchingBucket as ReputationEventDetails[]).find(b =>
                        b.post_id === item.post_id
                        && b.reputation_history_type === pair[1]
                        && b.creation_date >= item.creation_date
                        && !b.canIgnore
                    );

                    if (unupvote) {
                        unupvote.canIgnore = true;
                        reputationEventDetails.canIgnore = true;
                    }
                }
            });

            const typedBucket = matchingBucket as ReputationEventDetails[];
            reputationEventDetails.bucket = typedBucket;
            reputationEventDetails.vote_id = i++;
            typedBucket.push(reputationEventDetails);
        }
    });

    return buckets;
}

export function ProcessMetaData(items: ReputationEventDetails[], acceptableBuckets: ReputationEventDetails[][], moment: moment.MomentStatic) {
    const reversalTypes = ['user_deleted', 'vote_fraud_reversal'];

    const deletionEvents = items.filter(s => s.reputation_history_type === 'user_deleted');

    const automaticallyReversed = items.filter(s => {
        const date = moment.unix(s.creation_date).utc();
        if (s.reputation_history_type === 'vote_fraud_reversal') {
            if (date.minute() <= 5 && date.hour() === 3) {
                return true;
            }
        }
        if (s.reputation_history_type === 'asker_unaccept_answer') {
            const typedS = s as ReputationEventDetails;
            return typedS.bucket.find(f => f.reputation_history_type === 'vote_fraud_reversal');
        }
        return false;
    });
    const manuallyReversed = items.filter(s => {
        const date = moment.unix(s.creation_date).utc();
        if (s.reputation_history_type === 'vote_fraud_reversal') {
            if (date.minute() > 5 || date.hour() !== 3) {
                return true;
            }
        }

        if (s.reputation_history_type === 'asker_unaccept_answer') {
            const typedS = s as ReputationEventDetails;
            return typedS.bucket.find(f => f.reputation_history_type === 'vote_fraud_reversal');
        }
        return false;
    });

    items.forEach(typedRow => {
        const allData = (Array.prototype.concat.apply([], acceptableBuckets) as ReputationEventDetails[])
            .filter(d => reversalTypes.indexOf(d.reputation_history_type) < 0)
            .filter(d => d.post_id === typedRow.post_id && !d.canIgnore);

        const postHasDeletion = (reversal: ReputationEvent, current: ReputationEvent) =>
            reversal.post_id === current.post_id
            && reversal.creation_date > current.creation_date;
        const postHasAutomaticReversal = (reversal: ReputationEvent, current: ReputationEvent) =>
            reversal.post_id === current.post_id && (reversal.creation_date - typedRow.creation_date <= 60 * 60 * 24)
            && reversal.creation_date > current.creation_date;
        const postHasManualReversal = (reversal: ReputationEvent, current: ReputationEvent) => reversal.post_id === current.post_id
            && reversal.creation_date > current.creation_date;

        const findAll = (src: ReputationEvent[], func: (reversal: ReputationEvent, current: ReputationEvent) => boolean) => {
            return allData.filter(i => src.find(di => func(di, i)));
        };
        const countAll = (src: ReputationEvent[], func: (reversal: ReputationEvent, current: ReputationEvent) => boolean) => {
            return findAll(src, func).length;
        };

        const matchingDeletions = deletionEvents.filter(i => postHasDeletion(i, typedRow)).length;
        (typedRow as any).Reversals = [];
        if (matchingDeletions > 0) {
            const allVotes = countAll(deletionEvents, postHasDeletion);

            (typedRow as any).Reversals.push({
                ReversalName: 'UD',
                MatchingReversals: matchingDeletions,
                AllSuspiciousVotes: allVotes
            });
        }
        const matchingAutomaticReversals = automaticallyReversed.filter(i => postHasAutomaticReversal(i, typedRow)).length;
        if (matchingAutomaticReversals > 0) {
            const allVotes = countAll(automaticallyReversed, postHasAutomaticReversal);
            (typedRow as any).Reversals.push({
                ReversalName: 'AR',
                MatchingReversals: matchingAutomaticReversals,
                AllSuspiciousVotes: allVotes
            });
        }
        const matchingManualReversals = manuallyReversed.filter(i => postHasManualReversal(i, typedRow)).length;
        if (matchingManualReversals) {
            const allVotes = countAll(manuallyReversed, postHasManualReversal);
            (typedRow as any).Reversals.push({
                ReversalName: 'MR',
                MatchingReversals: matchingManualReversals,
                AllSuspiciousVotes: allVotes
            });
        }
    });
}
