import MessageOp from './MessageOp';

/*
When a node wants to send a broadcast, there are two options: either send
all messages at once or send them one by one. The difference is how "fast"
the sender is.
This class is a helper to send messages one by one, consuming a tick for each.
The node uses this class to "schedule" messages, they are added to the queue
and executed as any other command.
*/
class DeliverOp {
  constructor(messagesToDeliver) {
    if (!Array.isArray(messagesToDeliver)) {
      throw new Error("The parameter has to be a list");
    }
    messagesToDeliver.forEach(msg => {
      if (!(msg instanceof MessageOp)) {
        throw new Error("Can only deliver MessageOp instances: " + JSON.stringify(msg));
      }
    });
    this.messagesToDeliver = messagesToDeliver;
  }

  execute(node, tickNumber) {
    this.messagesToDeliver.forEach(msg => {
      console.log(`Sent ${msg.op} to ${msg.to}`);
      node.messageBroker.sendMessage(msg);
    });
  }
}

export default DeliverOp;
