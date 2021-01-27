/*
Every message is actually an operation to be executed by node on tick.
Some operations are local, e.g. sleep; others are messages being
send via the message broker.

This is the parent for all sendable messages.
*/
class MessageOp {
  constructor(toName, fromName) {
    if (typeof toName !== 'string' && toName instanceof String) {
      throw new Error("toName must be a string");
    }
    if (typeof fromName !== 'string' && fromName instanceof String) {
      throw new Error("fromName must be a string");
    }
    this.to = toName;
    this.from = fromName;
    this.op = this.constructor.name;
  }

  execute(node, tickNumber) {
    throw new Error("Must override this method");
  }
}

export default MessageOp;
