import PingNode from './PingNode';
import InitiatePingOp from './InitiatePingOp';

/*
Simple request/reply example. A sends a message to B and waits 10 ticks
for a reply.
*/
class Initializer {
  create(messageBroker) {
    const nodeA = new PingNode('A');
    const nodeB = new PingNode('B');
    nodeA.bind(messageBroker);
    nodeB.bind(messageBroker);
    nodeA.scheduleOp(new InitiatePingOp("B"));
  }

  controlUI() {
    return (
      <div>
        <h1>PING</h1>
        <div>Open debug console to see log message. Keep clicking Tick for step-by-step progress.</div>
        <div>To simulate a delay, use form below to add 12 ticks of sleep tp B and keep ticking.</div>
      </div>
    );
  }
}

export default Initializer;
