import MessageOp from '../MessageOp';
import AcceptedOp from './AcceptedOp';
import DeliverOp from '../DeliverOp';

/*
Processing of accept message
*/
class AcceptOp extends MessageOp {
  constructor(toName, fromName, proposalNumber, paxosInstanceId, value) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
    this.paxosInstanceId = paxosInstanceId;
    this.value = value;
  }
  execute(node, tickNumber) {
    const paxosInstance = node.state.paxos[this.paxosInstanceId];
    if (paxosInstance.isBehind(this.proposalNumber, this.from)||
      paxosInstance.isSame(this.proposalNumber, this.from)) {
        console.log('Accept is legit, accepting');
        paxosInstance.accept(this.proposalNumber, this.from, this.value);
        const learners = node.messageBroker.findByRole('paxos', true);
        learners.forEach(learner => {
          const accepted = new AcceptedOp(learner.name, node.name, paxosInstance.instanceId, this.value);
          const deliverOp = new DeliverOp([accepted]);
          node.scheduleOp(deliverOp);
        });
    } else {
      console.log('Already past, ignoring accept.');
    }
  }
}

export default AcceptOp;
