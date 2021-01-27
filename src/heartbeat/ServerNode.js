import Node from '../Node';
import IamAliveOp from './IamAliveOp';

/*
Server node. Keeps calling IamAliveOp to send hearbeat every 10 ticks.
*/
class ServerNode extends Node {
  constructor(name) {
    super(name);
    this.queue = [new IamAliveOp()];
    this.state = {
      nextBeatNotBefore: Math.floor(Math.random() * Math.floor(5))
    }
  }

}

export default ServerNode;
