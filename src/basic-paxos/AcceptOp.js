import MessageOp from '../MessageOp';
import AcceptedOp from './AcceptedOp';
import DeliverOp from '../DeliverOp';

/*
Accept operation called on acceptors.
*/
class AcceptOp extends MessageOp {
  constructor(toName, fromName, proposalNumber, value) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
    this.value = value;
  }
  execute(node, tickNumber) {
    console.log('Accepted check');
    if ((this.proposalNumber > node.state.proposalNumber)||
      ((this.proposalNumber === node.state.proposalNumber)&&(this.from >= node.state.proposedBy))) {
      console.log("Accepting value: " + this.value);
      node.state['acceptedValue'] = {
        proposalNumber: this.proposalNumber,
        poposedBy: this.from,
        value: this.value
      };
      const learners = node.messageBroker.findByRole('learner', true);
      learners.forEach(learner => {
        const accepted = new AcceptedOp(learner.name, node.name, this.value);
        const deliverOp = new DeliverOp([accepted]);
        node.scheduleOp(deliverOp);
      });
    } else {
      console.log("Got older accept, ignoring");
    }
  }
}

export default AcceptOp;
