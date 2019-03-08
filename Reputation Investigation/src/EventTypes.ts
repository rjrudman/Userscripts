import { UnionOfArraysToArrayOfUnions } from './Tools';

export const AllVoteTypes = [
    'asker_accepts_answer',
    'asker_unaccept_answer',
    'answer_accepted',
    'answer_unaccepted',
    'voter_downvotes',
    'voter_undownvotes',
    'post_downvoted',
    'post_undownvoted',
    'post_upvoted',
    'post_unupvoted',
    'suggested_edit_approval_received',
    'post_flagged_as_spam',
    'post_flagged_as_offensive',
    'bounty_given',
    'bounty_earned',
    'bounty_cancelled',
    'post_deleted',
    'post_undeleted',
    'association_bonus',
    'arbitrary_reputation_change',
    'vote_fraud_reversal',
    'post_migrated',
    'user_deleted',
    'example_upvoted',
    'example_unupvoted',
    'proposed_change_approved',
    'doc_link_upvoted',
    'doc_link_unupvoted',
    'doc_source_removed',
    'suggested_edit_approval_overridden'
] as const;
export type ReputationHistoryType = typeof AllVoteTypes[number];

export const ReversalTypes = [
    'asker_unaccept_answer',
    'answer_unaccepted',
    'user_deleted',
    'vote_fraud_reversal'
] as const;
export type ReversalType = typeof ReversalTypes[number];

export const ReversableTypes = [
    'asker_accepts_answer',
    'answer_accepted',
    'post_downvoted',
    'post_upvoted'
] as const;
export type ReversableType = typeof ReversableTypes[number];

export const OppositePairs = [
    'asker_accepts_answer',
    'asker_unaccept_answer',
    'answer_accepted',
    'answer_unaccepted',
    'voter_downvotes',
    'voter_undownvotes',
    'post_downvoted',
    'post_undownvoted',
    'post_upvoted',
    'post_unupvoted',
    'post_deleted',
    'post_undeleted'
] as const;
export type OppositePairType = typeof OppositePairs[number];

// For cases where a user changed their mind, not for events caused by the system or someone else
export const VoteOppositePairs = {
    asker_accepts_answer: 'asker_unaccept_answer' as const,
    asker_unaccept_answer: 'asker_accepts_answer' as const,
    answer_accepted: 'answer_unaccepted' as const,
    answer_unaccepted: 'answer_accepted' as const,
    voter_downvotes: 'voter_undownvotes' as const,
    voter_undownvotes: 'voter_downvotes' as const,
    post_downvoted: 'post_undownvoted' as const,
    post_undownvoted: 'post_downvoted' as const,
    post_upvoted: 'post_unupvoted' as const,
    post_unupvoted: 'post_upvoted' as const,
    post_deleted: 'post_undeleted' as const,
    post_undeleted: 'post_deleted' as const,
};

export const VoteReversalPairs = {
    asker_accepts_answer: ['asker_unaccept_answer'] as const,
    answer_accepted: ['answer_unaccepted'] as const,
    post_downvoted: ['user_deleted', 'vote_fraud_reversal'] as const,
    post_upvoted: ['user_deleted', 'vote_fraud_reversal'] as const,
    suggested_edit_approval_received: ['vote_fraud_reversal'] as const
};

export function IsReversableType(eventType: ReputationHistoryType): eventType is ReversableType {
    return !!ReversableTypes.find(rt => rt === eventType);
}

export function IsReversalType(eventType: ReputationHistoryType): eventType is ReversalType {
    return !!ReversalTypes.find(rt => rt === eventType);
}

export function HasOppositePair(eventType: ReputationHistoryType): eventType is OppositePairType {
    return !!OppositePairs.find(vop => vop === eventType);
}

export function GetReversalTypes(eventType: ReversableType): ReadonlyArray<ReversalType> {
    return UnionOfArraysToArrayOfUnions(VoteReversalPairs[eventType]);
}
