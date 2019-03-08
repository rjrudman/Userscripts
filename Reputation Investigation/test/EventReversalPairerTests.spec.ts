import { expect } from 'chai';
import { upvote, reversal } from './helpers/VoteCreationHelper';
import { FindEventReversals } from '../src/EventReversalPairer';
import { assertReversal, assertNotReversed } from './helpers/Assertions';

describe('Event reversal tests', () => {
    it('3 upvotes 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3)
        ];

        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 0 });
        expect(events[1]).to.include({ Pairs: 0 });
        expect(events[2]).to.include({ Pairs: 0 });

        expect(events[3]).to.include({ Pairs: 0 });
        expect(events[4]).to.include({ Pairs: 0 });
        expect(events[5]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 3);
        assertReversal(payload, events, 1, 4);
        assertReversal(payload, events, 2, 5);
    });

    it('6 upvotes 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3)
        ];

        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 1 });
        expect(events[1]).to.include({ Pairs: 1 });
        expect(events[2]).to.include({ Pairs: 1 });

        expect(events[3]).to.include({ Pairs: 1 });
        expect(events[4]).to.include({ Pairs: 1 });
        expect(events[5]).to.include({ Pairs: 1 });

        expect(events[6]).to.include({ Pairs: 0 });
        expect(events[7]).to.include({ Pairs: 0 });
        expect(events[8]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 6);
        assertReversal(payload, events, 1, 7);
        assertReversal(payload, events, 2, 8);
        assertReversal(payload, events, 3, 6);
        assertReversal(payload, events, 4, 7);
        assertReversal(payload, events, 5, 8);
    });

    it('3 upvotes 3 reversals 3 upvotes', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3),
            upvote(1), upvote(2), upvote(3)
        ];
        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 0 });
        expect(events[1]).to.include({ Pairs: 0 });
        expect(events[2]).to.include({ Pairs: 0 });

        expect(events[3]).to.include({ Pairs: 0 });
        expect(events[4]).to.include({ Pairs: 0 });
        expect(events[5]).to.include({ Pairs: 0 });

        expect(events[6]).to.include({ Pairs: 0 });
        expect(events[7]).to.include({ Pairs: 0 });
        expect(events[8]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 3);
        assertReversal(payload, events, 1, 4);
        assertReversal(payload, events, 2, 5);
        assertNotReversed(events[6]);
        assertNotReversed(events[7]);
        assertNotReversed(events[8]);
    });

    it('3 upvotes 3 reversals 3 upvotes 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3),
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3)
        ];

        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 0 });
        expect(events[1]).to.include({ Pairs: 0 });
        expect(events[2]).to.include({ Pairs: 0 });

        expect(events[3]).to.include({ Pairs: 0 });
        expect(events[4]).to.include({ Pairs: 0 });
        expect(events[5]).to.include({ Pairs: 0 });

        expect(events[6]).to.include({ Pairs: 0 });
        expect(events[7]).to.include({ Pairs: 0 });
        expect(events[8]).to.include({ Pairs: 0 });

        expect(events[9]).to.include({ Pairs: 0 });
        expect(events[10]).to.include({ Pairs: 0 });
        expect(events[11]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 3);
        assertReversal(payload, events, 1, 4);
        assertReversal(payload, events, 2, 5);
        assertReversal(payload, events, 6, 9);
        assertReversal(payload, events, 7, 10);
        assertReversal(payload, events, 8, 11);
    });

    it('3 upvotes 3 upvotes 3 reversals 3 upvotes', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3),
            upvote(1), upvote(2), upvote(3)
        ];

        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 1 });
        expect(events[1]).to.include({ Pairs: 1 });
        expect(events[2]).to.include({ Pairs: 1 });

        expect(events[3]).to.include({ Pairs: 1 });
        expect(events[4]).to.include({ Pairs: 1 });
        expect(events[5]).to.include({ Pairs: 1 });

        expect(events[6]).to.include({ Pairs: 0 });
        expect(events[7]).to.include({ Pairs: 0 });
        expect(events[8]).to.include({ Pairs: 0 });

        expect(events[9]).to.include({ Pairs: 0 });
        expect(events[10]).to.include({ Pairs: 0 });
        expect(events[11]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 6);
        assertReversal(payload, events, 1, 7);
        assertReversal(payload, events, 2, 8);
        assertReversal(payload, events, 3, 6);
        assertReversal(payload, events, 4, 7);
        assertReversal(payload, events, 5, 8);

        assertNotReversed(events[9]);
        assertNotReversed(events[10]);
        assertNotReversed(events[11]);
    });

    it('3 upvotes 3 upvotes 3 reversals 3 reversals', () => {
        const payload = [
            upvote(1), upvote(2), upvote(3),
            upvote(1), upvote(2), upvote(3),
            reversal(1), reversal(2), reversal(3),
            reversal(1), reversal(2), reversal(3),
        ];

        const events = FindEventReversals(payload);

        expect(events[0]).to.include({ Pairs: 1 });
        expect(events[1]).to.include({ Pairs: 1 });
        expect(events[2]).to.include({ Pairs: 1 });

        expect(events[3]).to.include({ Pairs: 1 });
        expect(events[4]).to.include({ Pairs: 1 });
        expect(events[5]).to.include({ Pairs: 1 });

        expect(events[6]).to.include({ Pairs: 0 });
        expect(events[7]).to.include({ Pairs: 0 });
        expect(events[8]).to.include({ Pairs: 0 });

        expect(events[9]).to.include({ Pairs: 0 });
        expect(events[10]).to.include({ Pairs: 0 });
        expect(events[11]).to.include({ Pairs: 0 });

        assertReversal(payload, events, 0, 6);
        assertReversal(payload, events, 1, 7);
        assertReversal(payload, events, 2, 8);
        assertReversal(payload, events, 3, 6);
        assertReversal(payload, events, 4, 7);
        assertReversal(payload, events, 5, 8);

        assertReversal(payload, events, 0, 9);
        assertReversal(payload, events, 1, 10);
        assertReversal(payload, events, 2, 11);
        assertReversal(payload, events, 3, 9);
        assertReversal(payload, events, 4, 10);
        assertReversal(payload, events, 5, 11);
    });
});
