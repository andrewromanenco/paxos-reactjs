// Base class for all nodes
class Node {
  // Each node has a name and optional roles.
  // Roles are used for node selection.
  constructor(name, roles) {
    this.name = name;
    if (roles) {
      if (Array.isArray(roles)) {
        this.roles = roles;
      } else {
        this.roles = [roles];
      }
    } else {
      this.roles = [];
    }
    this.queue = [];
    this.messageBroker = null;
    this.state = {};
  }

  // Registers the node with the message bus
  bind(messageBroker) {
    this.messageBroker = messageBroker;
    messageBroker.registerNode(this);
    return this;
  }

  // Add an operation into the execution queue. Add to tail.
  // Each tick one operation is executed.
  scheduleOp(op) {
    const q = [...this.queue];
    q.push(op);
    this.queue = q;
  }

  // Adds operations as the next to be executed.
  scheduleOpOnTop(op) {
    const q = [...this.queue];
    q.unshift(op);
    this.queue = q;
  }

  // Called every tick and executed next operation from the exec. queue.
  tick(tickNumber) {
    if (!this.messageBroker) {
      throw new Error("Message broker is not set for " + this.name);
    }
    if (this.queue.length === 0) {
      return;
    }
    const op = this.queue.shift();
    op.execute(this, tickNumber);
  }

  // Check if this node has operations to excute.
  hasScheduledOps() {
    return (this.queue.length > 0);
  }

  // Check if the node has a specific role.
  hasRole(role) {
    return this.roles.includes(role);
  }
}

export default Node;
