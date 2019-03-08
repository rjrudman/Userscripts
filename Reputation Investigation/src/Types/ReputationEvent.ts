import { ReputationHistoryType } from 'EventTypes';

export interface ReputationEvent {
    reputation_history_type: ReputationHistoryType;
    reputation_change: number;
    post_id: number;
    creation_date: number;

    title: string;
}
