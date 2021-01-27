import MessageOp from '../MessageOp';

/*
Accepted message called on learners when an accpetor accepts a value.
*/
class AcceptedOp extends MessageOp {
  constructor(toName, fromName, value) {
    super(toName, fromName);
    this.value = value;
  }
  execute(node, tickNumber) {
    console.log(`Learner ${node.name} notified about value: ${this.value}`);
    node.state.acceptedValues[this.from] = this.value;
  }
}

export default AcceptedOp;
