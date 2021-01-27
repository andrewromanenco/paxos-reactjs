import MessageOp from '../MessageOp';

/*
Ping reply opeation.
*/
class PingReplyOp extends MessageOp {
  execute(node, tickNumber) {
    console.log("Got ping back!");
    node.replyReceived();
  }
}

export default PingReplyOp;
