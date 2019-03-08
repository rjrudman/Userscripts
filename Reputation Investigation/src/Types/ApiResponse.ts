import { ReputationEvent } from './ReputationEvent';

export interface ApiResponse {
    items: ReputationEvent[];
    has_more: boolean;
    quota_max: number;
    quota_remaining: number;
}
