import MessageOp from './MessageOp';

/*
Main message bus - simulated network.
Allows connections b/n all nodes. Supports blocking channels b/n nodes.
*/
class MessageBroker {
  constructor() {
    this.nodes = [];
    this.brokenLinks = "[]";
  }

  /*
  Registered node is discoverable by name and role.
  */
  registerNode(newNode) {
    this.nodes.forEach(node => {
      if (node.name === newNode.name) {
        throw new Error('Name already registered: ' + node.name);
      }
    });
    this.nodes.push(newNode);
  }

  /*
  Broken links is a list of pairs of node names to block communication channel.
  This is used to simulate network partitioning.
  The config is supplied by user input and this methiod checks if the input
  is valid.
  */
  validateBrokenLinks() {
    try {
      const blockedPairsList = JSON.parse(this.brokenLinks);
      if (!Array.isArray(blockedPairsList)) {
        console.log("Broken list must be an array of pairs");
        return false;
      }
      var badElements = false;
      blockedPairsList.forEach(el => {
        if (!Array.isArray(el)) {
          badElements = true;
          console.error('Elements of block list must by lists like ["A", "B"] but got ' + JSON.stringify(el));
        }
      });
      if (badElements) {
        return false;
      }
    } catch(e) {
      console.log("Bad json for broken list, must be json, e.g. '[]' for empty");
      return false;
    };
    return true;
  }

  /*
  Yes, sendMessage method does send a message
  Message us delivered to target node's execution queue.
  Message is plain object and must have "to", "from" and "op".
  Messgae is deliverd unless the channel b/n nodes is offline.
  */
  sendMessage(message) {
    if (!(message instanceof MessageOp)) {
      throw Error('The message to send is not an instance of MessageOp: ' + JSON.stringify(message));
    }
    const blockedPairsList = JSON.parse(this.brokenLinks);
    var blocked = false;
    blockedPairsList.forEach(pair => {
      if (((pair[0] === message.to)&&(pair[1] === message.from))
          ||((pair[1] === message.to)&&(pair[0] === message.from))) {
            blocked = true;
          }
    });
    if (blocked) {
      console.log("Message is dropped due to block rule.");
      return;
    }
    var delivered = false;
    this.nodes.forEach(node => {
      if (node.name === message.to) {
        node.scheduleOp(message);
        delivered = true;
      }
    });
    if (!delivered) {
      throw new Error('Failed to deliver message: ' + JSON.stringify(message));
    }
  }

  /*
  Finds all registered nodes with given role.
  */
  findByRole(role, shuffle) {
    const result = [];
    this.nodes.forEach(node => {
      if (node.hasRole(role)) {
        result.push(node);
      }
    });

    if (shuffle) {
      var currentIndex = result.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = result[currentIndex];
        result[currentIndex] = result[randomIndex];
        result[randomIndex] = temporaryValue;
      }
    }
    return result;
  }

  /*
  Setter for channel blocking (to simulate network partition).
  */
  setBrokenLinks(brokenLinks) {
    this.brokenLinks = brokenLinks;
  }
}

export default MessageBroker;
