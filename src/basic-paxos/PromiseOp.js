import MessageOp from '../MessageOp';
import AcceptOp from './AcceptOp';
import DeliverOp from '../DeliverOp';

/*
Promise processing on a proposer.
*/
class PromiseOp extends MessageOp {
  constructor(toName, fromName, proposalNumber, alreadyAccepted) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
    this.alreadyAccepted = alreadyAccepted;
  }
  execute(node, tickNumber) {
    if (this.proposalNumber !==   node.state.proposalNumber) {
      console.log(`Was expecting promise on ${node.state.proposalNumber - 1}, but got ${this.proposalNumber}. Ignoring.`);
      return;
    }
    node.state.quorum[this.from] = [this.alreadyAccepted];
    const minForQuorum = Math.floor(node.messageBroker.findByRole('learner').length/2) + 1;
    if (Object.keys(node.state.quorum).length === minForQuorum) {
      console.log(`Got the majority(${minForQuorum}), sending accepts`);
      var value = null;
      var maxProposalNumber = 0;
      var maxProposedBy = '';
      Object.entries(node.state.quorum).forEach(([k,v]) => {
        if (v[0]) {
          if (value) {
            if ((v[0].proposalNumber > maxProposalNumber)||(
              (v[0].proposalNumber === maxProposalNumber)||(v[0].proposedBy > maxProposedBy)
            )) {
              value = v[0].value;
              maxProposalNumber = v[0].proposalNumber;
              maxProposedBy = v[0].proposedBy;
            }
          } else {
            value = v[0]['value'];
          }
        }
      });
      if (!value) {
        value = node.name + "/" + node.state.proposalNumber;
      }
      console.log("The value to send: " + value);
      const acceptors = node.messageBroker.findByRole('acceptor');
      acceptors.forEach(acceptor => {
        console.log("Scheduling accept for " + acceptor.name);
        const accept = new AcceptOp(acceptor.name, node.name, this.proposalNumber, value);
        const deliverOp = new DeliverOp([accept]);
        node.scheduleOp(deliverOp);
      });
    } else {
      console.log(`No majority(${minForQuorum}) yet`);
    }
  }
}

export default PromiseOp;
