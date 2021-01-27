import ServerNode from './ServerNode';
import WatcherNode from './WatcherNode';

/*
Heartbeat example. Three servers and three watchers. Watchers wait for
the hearbeat and if no detected for 15 ticks, then mark servers as Offline.
*/
class Initializer {
  create(messageBroker) {
    new ServerNode('Server-A').bind(messageBroker);
    new ServerNode('Server-B').bind(messageBroker);
    new ServerNode('Server-C').bind(messageBroker);

    new WatcherNode('Watcher-X').bind(messageBroker);
    new WatcherNode('Watcher-Y').bind(messageBroker);
    new WatcherNode('Watcher-Z').bind(messageBroker);
  }

  controlUI() {
    return (
      <div>
        <h1>Heart beat</h1>
        <div>Open debug console to see log message. Keep clicking Tick for step-by-step progress.</div>
        <div>Three nodes send heart beats to three watchers. Use channel block feature or add sleep to
        ServerNodes to see how watchers change their state.</div>
        <div>Watchers mark servers Offline if no heartbeat for 15 ticks.</div>
      </div>
    );
  }
}

export default Initializer;
