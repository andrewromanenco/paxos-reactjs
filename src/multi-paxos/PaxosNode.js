import Node from '../Node';
import DeliverOp from '../DeliverOp';
import PrepareOp from './PrepareOp';
import Paxos from './Paxos';
import CustomerResultOp from './CustomerResultOp';

/*
Paxos node with all three roles: proposer, acceptor and learners.
Node may be asked to propose a number and then the client is notified
if the value is accepted or not (in case some other value was chosen).
*/
class PaxosNode extends Node {
  constructor(name) {
    super(name, 'paxos');
    this.queue = [];
    this.state['log'] = [];
    this.state['paxos'] = {};
  }

  scheduleOp(message) {
    super.scheduleOp(message);
  }

  addToLog(value) {
    const indexToAdd = this.state.log.length;
    console.log(`${this.name} asked to add ${value} to log at index ${indexToAdd}`);
    this.state.valueToSend = value;
    this.state.valueToSendAtIndex = indexToAdd;
    const paxosInstance = new Paxos(indexToAdd, 3);
    this.state.paxos[indexToAdd] = paxosInstance;
    const nodes = this.messageBroker.findByRole('paxos', true);
    nodes.forEach(node => {
      const prepare = new PrepareOp(
        node.name,
        this.name,
        paxosInstance.proposalNumber,
        paxosInstance.instanceId);
      const deliverOp = new DeliverOp([prepare]);
      this.scheduleOp(deliverOp);
    });
  }

  logFinalValue(logIndex, value) {
    const currentEntry = this.state.log[logIndex];
    if (currentEntry) {
      if (currentEntry !== value) {
        throw new Error(`Got ${value} at [${logIndex}], while expecting ${currentEntry}`);
      }
    } else {
      this.state.log[logIndex] = value;
      console.log(`Learned about ${value} for index ${logIndex}`);
      if (this.state.valueToSendAtIndex === logIndex) {
        // we asked for this index
        if (value === this.state.valueToSend) {
          // tell client ok
          this.messageBroker.sendMessage(new CustomerResultOp(
            'client', this.name, this.state.valueToSend, 'accepted'
          ));
        } else {
          // tell client decline
          this.messageBroker.sendMessage(new CustomerResultOp(
            'client', this.name, this.state.valueToSend, 'not accepted'
          ));
        }
        this.state.valueToSend = null;
        this.state.valueToSendAtIndex = 0;
      }
    }
  }
}

export default PaxosNode;
