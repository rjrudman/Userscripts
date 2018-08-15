export interface ApiResponse {
    items: ReputationEvent[];
    has_more: boolean;
    quota_max: number;
    quota_remaining: number;
}

export interface ReputationEvent {
    reputation_history_type: 'post_upvoted' | 'user_deleted' | 'post_unupvoted' | 'vote_fraud_reversal' | 'association_bonus' | 'asker_unaccept_answer';
    reputation_change: number;
    post_id: number;
    creation_date: number;
    user_id: number;
}
