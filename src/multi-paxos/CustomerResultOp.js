import MessageOp from '../MessageOp';

/*
Update result of a paxos run. A number is either accepted or rejected.
*/
class CustomerResultOp extends MessageOp {
  constructor(toName, fromName, value, status) {
    super(toName, fromName);
    this.value = value;
    this.status = status;
  }

  execute(node, tickNumber) {
    node.state.progress[this.value] = this.status;
  }
}

export default CustomerResultOp;
