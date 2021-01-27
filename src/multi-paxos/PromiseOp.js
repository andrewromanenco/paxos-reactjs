import MessageOp from '../MessageOp';
import DeliverOp from '../DeliverOp';
import AcceptOp from './AcceptOp';

/*
Called on proposers when promise is received
*/
class PromiseOp extends MessageOp {
  constructor(toName, fromName, proposalNumber, paxosInstanceId, acceptedValue) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
    this.paxosInstanceId = paxosInstanceId;
    this.acceptedValue = acceptedValue;
  }
  execute(node, tickNumber) {
    console.log(`Got promise from ${this.from} on ${this.proposalNumber} for instance ${this.paxosInstanceId}`);
    const paxosInstance = node.state.paxos[this.paxosInstanceId];
    console.assert(paxosInstance);
    paxosInstance.promises[this.from] = this.acceptedValue;
    const promisesCount = Object.keys(paxosInstance.promises).length;
    if (promisesCount === paxosInstance.majority) {
      var value = paxosInstance.pickLargestAcceptedValue();
      console.log(`Largest promise ${value}`);
      if (!value) {
        value = node.state.valueToSend;
      }
      console.log(`Got majority (${paxosInstance.majority}) and the value to send is ${value}`);
      const acceptors = node.messageBroker.findByRole('paxos', true);
      acceptors.forEach(acceptor => {
        console.log(`Scheduling accept for ${acceptor.name} value ${value} in ${this.proposalNumber}@${paxosInstance.instanceId}`);
        const accept = new AcceptOp(acceptor.name, node.name, this.proposalNumber, paxosInstance.instanceId, value);
        const deliverOp = new DeliverOp([accept]);
        node.scheduleOp(deliverOp);
      });
    }
    if (promisesCount > paxosInstance.majority) {
      console.log("Past majority already, ignoring");
    }

  }
}

export default PromiseOp;
