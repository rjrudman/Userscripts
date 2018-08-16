import { PayloadOne } from './Payloads/Payloads';
import { ReputationEvent } from '../ReptuationApiResponse';
import { ProcessIntoBuckets, ReputationEventDetails, ProcessMetaData } from '../ReputationAnalyser';
import { expect } from 'chai';
import * as moment from 'moment';

describe('Payload 1', () => {
    it('should properly calculate', () => {
        const buckets = ProcessIntoBuckets(PayloadOne.items as ReputationEvent[], 45);
        const acceptableBuckets = buckets.filter(b => b.filter(bb => !bb.canIgnore).length >= 3);
        ProcessMetaData(PayloadOne.items as ReputationEventDetails[], acceptableBuckets, moment);

        expect(buckets.length).to.equal(26);

        const lastSerialVotes = buckets[3];
        AssertReversal(lastSerialVotes[0], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[1], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[2], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[3], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[4], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[5], 'AR', 1, 1);

        AssertReversal(lastSerialVotes[6], 'AR', 1, 2);
        AssertReversal(lastSerialVotes[7], 'AR', 1, 2);
        AssertReversal(lastSerialVotes[8], 'AR', 1, 2);

        AssertReversal(lastSerialVotes[9], 'AR', 1, 1);
        AssertReversal(lastSerialVotes[10], 'AR', 1, 1);
    });
});

function AssertReversal(row: any, reversalName: string, matchingVotes: number, allSuspiciousVotes: number) {
    expect(row.Reversals[0].ReversalName).to.equal(reversalName);
    expect(row.Reversals[0].MatchingReversals).to.equal(matchingVotes);
    expect(row.Reversals[0].AllSuspiciousVotes).to.equal(allSuspiciousVotes);
}
