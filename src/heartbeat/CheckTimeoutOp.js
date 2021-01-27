/*
When called the operation checks if there are stale servers.
After call the operations adds itself back to the queue to be called later.
*/
class CheckTimeoutOp {
  constructor() {
    this.op = this.constructor.name;
  }

  /*
  Go over servers seens so far and mark them Offline in no hearbeat for 15 ticks.
  */
  execute(node, tickNumber) {
    Object.entries(node.state).forEach(([name,[lastSeen, status]]) => {
      const diff = tickNumber - lastSeen;
      if (diff > 15) {
        console.log(`Server ${name} is OFFLINE. No beat for ${diff} ticks.`);
        node.state[name][1] = 'OFFLINE';
      }
    });
    node.scheduleOp(this);
  }
}

export default CheckTimeoutOp;
