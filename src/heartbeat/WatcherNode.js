import Node from '../Node';
import CheckTimeoutOp from './CheckTimeoutOp';

/*
Initally the watcher knows nothing about any servers.
As soon as first beat arrives, the sender get tracked.
A sender is alive if there is a beat in last 10 ticks.
*/
class WatcherNode extends Node {
  constructor(name) {
    super(name);
    this.roles = ['watcher'];
    this.queue = [new CheckTimeoutOp()];
  }

  gotBeatFrom(name, tickNumber) {
    console.log("Recevied a beat from " + name);
    this.state[name] = [tickNumber, 'ALIVE'];
  }
}

export default WatcherNode;
