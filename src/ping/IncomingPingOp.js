import MessageOp from '../MessageOp';
import PingReplyOp from './PingReplyOp'

/*
Operation set in a node queue when a ping arrives.
Logs and sends a reply.
*/
class IncomingPingOp extends MessageOp {
  execute(node, tickNumber) {
    console.log("Got a ping request, sending back a reply");
    node.messageBroker.sendMessage(new PingReplyOp(this.from, node.name));
  }
}

export default IncomingPingOp;
