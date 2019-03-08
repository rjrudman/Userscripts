import { ReputationHistoryType } from '../../src/EventTypes';

let currentCreationDate = 1;
export function upvote(postId: number, incrementAmount?: number) {
    return {
        reputation_history_type: 'post_upvoted' as ReputationHistoryType,
        reputation_change: 2,
        post_id: postId,
        creation_date: nextDate(incrementAmount),
        title: ''
    };
}

export function unupvote(postId: number, incrementAmount?: number) {
    return {
        reputation_history_type: 'post_unupvoted' as ReputationHistoryType,
        reputation_change: -2,
        post_id: postId,
        creation_date: nextDate(incrementAmount),
        title: ''
    };
}

export function accept(postId: number, incrementAmount?: number) {
    return {
        reputation_history_type: 'asker_accepts_answer' as ReputationHistoryType,
        reputation_change: 2,
        post_id: postId,
        creation_date: nextDate(incrementAmount),
        title: ''
    };
}

export function unaccept(postId: number, incrementAmount?: number) {
    return {
        reputation_history_type: 'asker_unaccept_answer' as ReputationHistoryType,
        reputation_change: -2,
        post_id: postId,
        creation_date: nextDate(incrementAmount),
        title: ''
    };
}

export function reversal(postId: number, incrementAmount?: number) {
    return {
        reputation_history_type: 'vote_fraud_reversal' as ReputationHistoryType,
        reputation_change: -2,
        post_id: postId,
        creation_date: nextDate(incrementAmount),
        title: ''
    };
}

export function nextDate(incrementAmount?: number) {
    if (incrementAmount === undefined) {
        incrementAmount = 1;
    }

    currentCreationDate += incrementAmount;
    return currentCreationDate;
}
