import Node from '../Node';
import PauseOp from '../PauseOp';
import SendPrepareOp from './SendPrepareOp';

/*
Proposal will propose it's name as a value to agree on.
On start, proposal adds a random sleep to add a bit of variance to the flow.
*/
class ProposerNode extends Node {
  constructor(name) {
    super(name, 'proposer');
    this.queue = [
      new PauseOp(Math.floor(Math.random() * Math.floor(25))),
      new SendPrepareOp()
    ];
    this.state['proposalNumber'] = 0;
    this.state['quorum'] = {};
  }
}

export default ProposerNode;
