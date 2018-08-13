export interface ApiResponse {
    items: ReputationEvent[];
    has_more: boolean;
    quota_max: number;
    quota_remaining: number;
}

export interface ReputationEvent {
    reputation_history_type: string;
    reputation_change: number;
    post_id: number;
    creation_date: number;
    user_id: number;
}
