import { expect } from 'chai';
import { upvote, reversal } from './helpers/VoteCreationHelper';
import { assertReversal, assertNotReversed } from './helpers/Assertions';
import { ProcessEvents } from '../src/EventProcessor';

const FORTY_SECONDS = 40 * 1000;

describe('Grouping and pairing', () => {
    it('3 upvotes 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3)
        ];

        const processedEvents = ProcessEvents(payload);

        expect(processedEvents[0]).to.include({ ...payload[0], BucketIndex: 0 });
        expect(processedEvents[1]).to.include({ ...payload[1], BucketIndex: 0 });
        expect(processedEvents[2]).to.include({ ...payload[2], BucketIndex: 0 });

        expect(processedEvents[3]).to.include({ ...payload[3], BucketIndex: 1 });
        expect(processedEvents[4]).to.include({ ...payload[4], BucketIndex: 1 });
        expect(processedEvents[5]).to.include({ ...payload[5], BucketIndex: 1 });

        expect(processedEvents[0]).to.include({ Pairs: 0 });
        expect(processedEvents[1]).to.include({ Pairs: 0 });
        expect(processedEvents[2]).to.include({ Pairs: 0 });

        expect(processedEvents[3]).to.include({ Pairs: 0 });
        expect(processedEvents[4]).to.include({ Pairs: 0 });
        expect(processedEvents[5]).to.include({ Pairs: 0 });

        assertReversal(payload, processedEvents, 0, 3);
        assertReversal(payload, processedEvents, 1, 4);
        assertReversal(payload, processedEvents, 2, 5);
    });

    it('3 upvotes with gap 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2, FORTY_SECONDS), upvote(3, FORTY_SECONDS),
            reversal(1), reversal(2), reversal(3)
        ];

        const processedEvents = ProcessEvents(payload);

        expect(processedEvents[0]).to.include({ ...payload[0], IsBucketed: false });
        expect(processedEvents[1]).to.include({ ...payload[1], IsBucketed: false });
        expect(processedEvents[2]).to.include({ ...payload[2], IsBucketed: false });

        expect(processedEvents[3]).to.include({ ...payload[3], BucketIndex: 0 });
        expect(processedEvents[4]).to.include({ ...payload[4], BucketIndex: 0 });
        expect(processedEvents[5]).to.include({ ...payload[5], BucketIndex: 0 });

        expect(processedEvents[0]).to.include({ Pairs: 0 });
        expect(processedEvents[1]).to.include({ Pairs: 0 });
        expect(processedEvents[2]).to.include({ Pairs: 0 });

        expect(processedEvents[3]).to.include({ Pairs: 0 });
        expect(processedEvents[4]).to.include({ Pairs: 0 });
        expect(processedEvents[5]).to.include({ Pairs: 0 });

        assertNotReversed(processedEvents[0]);
        assertNotReversed(processedEvents[1]);
        assertNotReversed(processedEvents[2]);
    });
});
