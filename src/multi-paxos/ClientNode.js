import Node from '../Node';
import CustomerCommand from './CustomerCommand';

/*
Client proposes a value and tracks progress.
*/
class ClientNode extends Node {
  constructor() {
    super('client', 'client');
    this.state.values = [1,2,3,4,5,6,7,8,9];
    this.state.progress = {};
  }

  sendNext() {
    console.log("Init send command");
    this.scheduleOp(new CustomerCommand());
  }
}

export default ClientNode;
