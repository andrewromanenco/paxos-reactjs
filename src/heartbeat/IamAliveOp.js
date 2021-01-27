import BeatOp from './BeatOp';
import DeliverOp from '../DeliverOp';

/*
When called, the operation sends heartbeat to every watcher.
The operation reschedules itself.
Heartbeat is sent every 10 ticks.
*/
class IamAliveOp {
  constructor() {
    this.op = this.constructor.name;
  }

  execute(node, tickNumber) {
    if (tickNumber >= node.state.nextBeatNotBefore) {
      node.state.nextBeatNotBefore += 10;
      const watchers = node.messageBroker.findByRole('watcher');
      console.log(`Schedule beat delivery to ${watchers.length} watchers`);
      watchers.forEach(w => {
        const beatOp = new BeatOp(w.name, node.name);
        const deliverOp = new DeliverOp([beatOp]);
        node.scheduleOp(deliverOp);
      });
    } else {
      console.log("Alive, but not the beat time yet");
    }
    node.scheduleOp(this);
  }
}

export default IamAliveOp;
