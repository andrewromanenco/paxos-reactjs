import MessageOp from '../MessageOp';
import AcceptorNode from './AcceptorNode';
import PromiseOp from './PromiseOp';

/*
Prepare processing on acceptors.
*/
class PrepareOp extends MessageOp {
  constructor(toName, fromName, proposalNumber) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
  }
  execute(node, tickNumber) {
    console.assert(node instanceof AcceptorNode);
    if ((this.proposalNumber > node.state.proposalNumber)||
      ((this.proposalNumber === node.state.proposalNumber)&&(this.from > node.state.proposedBy))) {
      console.log(`Promising ${this.proposalNumber} to ${this.from}`);
      node.state.proposalNumber = this.proposalNumber;
      node.state.proposedBy = this.from;
      node.messageBroker.sendMessage(
        new PromiseOp(this.from, node.name, node.state.proposalNumber, node.state.acceptedValue));
    } else {
      console.log(`Prepare is too old ${this.proposalNumber} vs ${node.state.proposalNumber}, and ${this.from} vs ${node.state.proposedBy}. Ignoring.`);
    }
  }
}

export default PrepareOp;
