/*
Take not yet committed number and send to a random non-busy paxos node.
*/
class CustomerCommand {
  constructor() {
    this.op = this.constructor.name;
  }

  execute(node, tickNumber) {
    // when called, takes next command-value and sends to a random paxos node
    const paxosNodes = node.messageBroker.findByRole('paxos', true);
    var value;
    node.state.values.forEach(v => {
      if (!value) {
        if (!node.state.progress[v]
          || ((node.state.progress[v] !== 'accepted')
        && !node.state.progress[v].startsWith('in-progress'))) {
              value = v;
        }
      }
    });
    if (value) {
      var sent = false;
      for (var i = 0; i < paxosNodes.length; i++) {
        if (!paxosNodes[i].state.valueToSend) {
          paxosNodes[i].addToLog(value);
          node.state.progress[value] = 'in-progress:' + paxosNodes[i].name;
          sent = true;
          break;
        }
      }
      if (!sent) {
        node.state.progress[value] = 'nodes-busy';
      }
    } else {
      console.log("No more values");
    }
  }
}

export default CustomerCommand;
