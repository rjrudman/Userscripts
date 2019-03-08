import { ProcessBuckets } from '../src/EventGrouper';
import { expect } from 'chai';
import { ReputationEvent } from 'Types/ReputationEvent';
import { upvote, unupvote, reversal, accept, unaccept } from './helpers/VoteCreationHelper';

describe('Grouping', () => {
    it('u1-uu1-u1 should be grouped for the same post', () => {
        const payload = [
            upvote(1), unupvote(1), upvote(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], Cancelled: true, BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], Cancelled: true, BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
    });

    it('u1-uu1-uu1 should not be grouped', () => {
        const payload = [
            upvote(1), unupvote(1), unupvote(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], Cancelled: true, BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], Cancelled: true, BucketIndex: 1 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
    });

    it('u1-uu1-u2-u1-uu1-u1 should be grouped', () => {
        const payload = [
            upvote(1), unupvote(1), upvote(2), upvote(1), unupvote(1), upvote(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(6);
        expect(events[0]).to.include({ ...payload[0], Cancelled: true, BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], Cancelled: true, BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
        expect(events[3]).to.include({ ...payload[3], Cancelled: true, BucketIndex: 0 });
        expect(events[4]).to.include({ ...payload[4], Cancelled: true, BucketIndex: 0 });
        expect(events[5]).to.include({ ...payload[5], BucketIndex: 0 });
    });

    it('u1-u1-u1 should not be grouped for the same post', () => {
        const payload = [
            upvote(1), upvote(1), upvote(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 1 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 2 });
    });

    it('u1-uu2-u1 should not be grouped for the same post', () => {
        const payload = [
            upvote(1), unupvote(2), upvote(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 1 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 2 });
    });

    it('u1-u1-r1 should not be grouped for the same post', () => {
        const payload = [
            upvote(1), upvote(2), reversal(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 1 });
    });

    it('u1-r1-u1 should be grouped for the same post', () => {
        const payload = [
            upvote(1), reversal(1), upvote(2)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 1 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
    });

    it('u1-a1-ua1-r1 should split reversals', () => {
        const payload = [
            upvote(1),
            accept(1),
            unaccept(1),
            reversal(1)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(4);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
        expect(events[3]).to.include({ ...payload[3], BucketIndex: 1 });
    });

    it('u1-u2-u3 should be grouped', () => {
        const payload = [
            upvote(1),
            upvote(2),
            upvote(3)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(3);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
    });

    it('u1-u2-u3 r1-r2-r3 should have two buckets', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            reversal(1, 40000), reversal(2), reversal(3)
        ];

        const events = processBucketsThirtySeconds(payload);
        expect(events.length).to.equal(6);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });

        expect(events[3]).to.include({ ...payload[3], BucketIndex: 1 });
        expect(events[4]).to.include({ ...payload[4], BucketIndex: 1 });
        expect(events[5]).to.include({ ...payload[5], BucketIndex: 1 });
    });

    it('something', () => {
        const payload = [
            {
                reputation_history_type: 'post_upvoted' as const,
                reputation_change: 10,
                post_id: 49035492,
                creation_date: 1553004864,
                user_id: 5578773,
                title: ''
            },
            {
                reputation_history_type: 'post_upvoted' as const,
                reputation_change: 10,
                post_id: 38532792,
                creation_date: 1553004899,
                user_id: 5578773,
                title: ''
            },
            {
                reputation_history_type: 'post_upvoted' as const,
                reputation_change: 10,
                post_id: 47079983,
                creation_date: 1553004924,
                user_id: 5578773,
                title: ''
            },
            {
                reputation_history_type: 'post_upvoted' as const,
                reputation_change: 5,
                post_id: 46995671,
                creation_date: 1553004927,
                user_id: 5578773,
                title: ''
            }
        ];

        const events = ProcessBuckets(payload, 40 * 1000, 3);
        expect(events.length).to.equal(4);
        expect(events[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(events[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(events[2]).to.include({ ...payload[2], BucketIndex: 0 });
        expect(events[3]).to.include({ ...payload[3], BucketIndex: 0 });
    });
});

const THIRTY_SECONDS = 30 * 1000;
function processBucketsThirtySeconds(payload: ReputationEvent[], minBucketSize: number = 0) {
    return ProcessBuckets(payload, THIRTY_SECONDS, minBucketSize);
}
