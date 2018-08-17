import { PayloadOne } from './Payloads/Payloads';
import { ReputationEvent } from '../src/ReptuationApiResponse';
import { ProcessIntoBuckets, ReputationEventDetails, ProcessMetaData } from '../src/ReputationAnalyser';
import { expect } from 'chai';
import * as moment from '../node_modules/moment';

describe('Payload 1', () => {
    it('should properly calculate', () => {
        const buckets = ProcessIntoBuckets(PayloadOne.items as ReputationEvent[], 45);
        const acceptableBuckets = buckets.filter(b => b.filter(bb => !bb.canIgnore).length >= 3);

        ProcessMetaData(PayloadOne.items as ReputationEventDetails[], acceptableBuckets, moment as any);

        expect(buckets.length).to.equal(26);

        const lastSerialVotes = buckets[3];
        AssertRowReversals(lastSerialVotes, [
            ['AR', 1, 1],
            ['AR', 1, 1],
            ['AR', 1, 1],
            ['AR', 1, 1],
            ['AR', 1, 1],
            ['AR', 1, 1],

            ['AR', 1, 2], // This is wrong. There was only one eligible vote to be reversed here
            ['AR', 1, 2], // These three should all be 1/1
            ['AR', 1, 2],

            ['AR', 1, 1],
            ['AR', 1, 1],
        ]);
    });
});

function AssertRowReversals(events: ReputationEventDetails[], items: any[]) {
    items.forEach((item, index) => {
        AssertReversal(events[index], item[0], item[1], item[2]);
    });
}

function AssertReversal(row: any, reversalName: string, matchingVotes: number, allSuspiciousVotes: number) {
    expect(row.Reversals[0].ReversalName).to.equal(reversalName);
    expect(row.Reversals[0].MatchingReversals).to.equal(matchingVotes);
    expect(row.Reversals[0].AllSuspiciousVotes).to.equal(allSuspiciousVotes);
}
