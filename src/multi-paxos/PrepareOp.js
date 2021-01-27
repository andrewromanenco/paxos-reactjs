import MessageOp from '../MessageOp';
import PromiseOp from './PromiseOp';
import Paxos from './Paxos';

/*
Called on acceptors on prepare request
*/
class PrepareOp extends MessageOp {
  constructor(toName, fromName, proposalNumber, paxosInstanceId) {
    super(toName, fromName);
    this.proposalNumber = proposalNumber;
    this.paxosInstanceId = paxosInstanceId;
  }
  execute(node, tickNumber) {
    console.log(`Got prepare from ${this.from} for instance ${this.paxosInstanceId} and proposalNum ${this.proposalNumber}`);
    var paxosInstance;
    if (node.state.paxos[this.paxosInstanceId]) {
      paxosInstance = node.state.paxos[this.paxosInstanceId];
    } else {
      paxosInstance = new Paxos(this.paxosInstanceId, 3);
      node.state.paxos[this.paxosInstanceId] = paxosInstance;
    }
    //if (this.proposalNumber > paxosInstance.promisedProposalNumber) {
    if (paxosInstance.isBehind(this.proposalNumber, this.from)) {
      paxosInstance.updatePromise(this.proposalNumber, this.from);
      // send promise back to proposer
      node.messageBroker.sendMessage(new PromiseOp(
        this.from,
        node.name,
        paxosInstance.promisedProposalNumber,
        paxosInstance.instanceId,
        paxosInstance.acceptedValue));
    } else {
      console.log(`Too old, current is ${paxosInstance.promisedProposalNumber}, ignoring`);
    }

    // if ((this.proposalNumber > node.state.proposalNumber)||
    //   ((this.proposalNumber === node.state.proposalNumber)&&(this.from > node.state.proposedBy))) {
    //   console.log(`Promising ${this.proposalNumber} to ${this.from}`);
    //   node.state.proposalNumber = this.proposalNumber;
    //   node.state.proposedBy = this.from;
    //   node.messageBroker.sendMessage(
    //     new PromiseOp(this.from, node.name, node.state.proposalNumber, node.state.acceptedValue));
    // } else {
    //   console.log(`Prepare is too old ${this.proposalNumber} vs ${node.state.proposalNumber}, and ${this.from} vs ${node.state.proposedBy}. Ignoring.`);
    // }
  }
}

export default PrepareOp;
