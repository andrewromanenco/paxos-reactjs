import Node from '../Node';

/*
Node to execute ping request/response.
*/
class PingNode extends Node {
  /*
  Is called when PingReplyOp is executed.
  */
  replyReceived() {
    this.state.gotReply = true;
  }
}

export default PingNode;
