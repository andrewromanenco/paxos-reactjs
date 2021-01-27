/*
Bounded wait waits till tickToWait
if waitConditionFn is true, the wait is cancelled
otherwise it is rescheduling itself
if tickToWait passed and waitConditionFN still false, timeoutFn is called
*/
class Timeout {
  constructor(tickToWait, waitConditionFn, timeoutFn, label) {
    this.tickToWait = tickToWait;
    this.waitConditionFn = waitConditionFn;
    this.timeoutFn = timeoutFn;
    this.label = label;
    this.op = this.constructor.name;
  }

  execute(node, tickNumber) {
    if (this.waitConditionFn(node)) {
      console.log("Condition met in " + this.label);
      return;
    }
    if (tickNumber < this.tickToWait) {
      console.log("Still waiting");
      node.scheduleOp(this);
      return;
    }
    // time out
    console.log("Timed out: " + this.label);
    this.timeoutFn(node);
  }
}

export default Timeout;
