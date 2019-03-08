import { ReputationEvent } from '../../src/Types/ReputationEvent';
import { EventWithReversalData } from '../../src/EventReversalPairer';
import { expect } from 'chai';

export function assertReversal(
    payload: ReputationEvent[],
    processedEvents: EventWithReversalData<ReputationEvent>[],
    eventIndex: number,
    reversalIndex: number) {

    expect(processedEvents[eventIndex].ReversedBy.some(rb => rb.OriginalEvent === payload[reversalIndex])).to.eq(true);
    expect(processedEvents[reversalIndex].Reversed.some(r => r.OriginalEvent === payload[eventIndex])).to.eq(true);
}

export function assertNotReversed(event: EventWithReversalData<ReputationEvent>) {
    expect(event.ReversedBy.length).to.eq(0);
}
