import PaxosNode from './PaxosNode';
import ClientNode from './ClientNode';
import Button from '@material-ui/core/Button';

class Initializer {
  create(messageBroker) {
    this.clientNode = new ClientNode();
    this.clientNode.bind(messageBroker);
    new PaxosNode('PaxosNode-A').bind(messageBroker);
    new PaxosNode('PaxosNode-B').bind(messageBroker);
    new PaxosNode('PaxosNode-C').bind(messageBroker);
    this.send = this.send.bind(this);
  }

  controlUI() {
    return (
      <div>
        <h1>Multi Paxos</h1>
        <div>Open debug console to see log message. Keep clicking Tick for step-by-step progress.</div>
        <div>On SendMessage the client proposes a not-yet committed number to a random paxos node.
        The node initates a paxos instance to write the number to the log and report the
        status to the client. Basically, click SendMessage and keep clicking Tick.</div>
        <Button variant="contained" onClick={this.send}>Send message</Button>
      </div>
    );
  }

  send() {
    this.clientNode.sendNext();
  }
}

export default Initializer;
