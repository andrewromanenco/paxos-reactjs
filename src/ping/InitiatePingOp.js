import MessageOp from '../MessageOp';
import IncomingPingOp from './IncomingPingOp';
import Timeout from '../Timeout';

/*
This operation actually sens a message to the other node.
*/
class InitiatePingOp extends MessageOp {
  execute(node, tickNumber) {
    console.log("Executing " + this.op + " and sending ping to " + this.to);
    node.messageBroker.sendMessage(new IncomingPingOp(this.to, node.name));
    const timeout = new Timeout(tickNumber + 10,
      (node) => {return node.state.gotReply;},
      (node) => {node.state.timedOut = true;},
      "Wait for reply");
    node.scheduleOp(timeout);
  }
}

export default InitiatePingOp;
