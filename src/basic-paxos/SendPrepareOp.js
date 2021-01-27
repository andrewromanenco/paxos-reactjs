import DeliverOp from '../DeliverOp';
import PrepareOp from './PrepareOp';
import PauseOp from '../PauseOp';

/*
Send a proposal to all acceptors. Also, adds a random delay to have some
variance in the process.
*/
class SendPrepareOp {
  constructor() {
    this.op = this.constructor.name;
  }

  execute(node, tickNumber) {
    const acceptors = node.messageBroker.findByRole('acceptor', true);
    console.log(`Sending a proposal to ${acceptors.length} acceptors.`);
    acceptors.forEach(acceptor => {
      const prepare = new PrepareOp(acceptor.name, node.name, node.state.proposalNumber + 1);
      const deliverOp = new DeliverOp([prepare]);
      node.scheduleOp(new PauseOp(Math.floor(Math.random() * Math.floor(20))));
      node.scheduleOp(deliverOp);
    });
    node.state.proposalNumber = node.state.proposalNumber + 1;
  }
}

export default SendPrepareOp;
