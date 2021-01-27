import MessageOp from '../MessageOp';

/*
Processing of accepted messages.
*/
class AcceptedOp extends MessageOp {
  constructor(toName, fromName, paxosInstanceId, value) {
    super(toName, fromName);
    this.paxosInstanceId = paxosInstanceId;
    this.value = value;
  }
  execute(node, tickNumber) {
    console.log(`Learner ${node.name} notified about value ${this.value} at index ${this.paxosInstanceId}`);
    const paxosInstance = node.state.paxos[this.paxosInstanceId];
    if (paxosInstance.gotFinalValue(this.from, this.value)) {
      console.log(`Got final value ${paxosInstance.finalValue} for ${paxosInstance.instanceId}`);
      node.logFinalValue(paxosInstance.instanceId, paxosInstance.finalValue);
    } else {
      console.log("Not yet");
    }
  }
}

export default AcceptedOp;
