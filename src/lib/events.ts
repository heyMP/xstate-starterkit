// eslint-disable-next-line max-classes-per-file
import { ComposedEvent } from '@patternfly/pfe-core';
import { GlobalMachineEvent } from '../machines/globalMachine';

const eventOptions = {
  bubbles: true,
  composed: true,
};

export class SendEvent extends ComposedEvent {
  /**
   * Send global machine events
   */
  constructor(public event: GlobalMachineEvent) {
    super('SEND', eventOptions);
  }
}
