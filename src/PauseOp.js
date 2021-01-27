/*
Non sendable operation, which sleeps for the given number of ticks.
This operation may simulate a node being busy. The node will still be
able to receive messages, but win't process them.
*/
class PauseOp {
  constructor(sleep) {
    this.sleep = sleep;
  }

  execute(node, tickNumber) {
    if (this.sleep > 1) {
      console.log("Still sleeping for " + (this.sleep - 1));
      node.scheduleOpOnTop(new PauseOp(this.sleep - 1));
    } else {
      console.log("Slept enough");
    }
  }

}

export default PauseOp;
