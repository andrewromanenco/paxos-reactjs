import ProposerNode from './ProposerNode';
import AcceptorNode from './AcceptorNode';
import LearnerNode from './LearnerNode';

/*
Basic paxos example.
Two proposers, three acceptors and two learners.
Each proposer proposes its name.
Each roposer has a random inital delay to add a bit of variance.
*/
class Initializer {
  create(messageBroker) {
    new ProposerNode('Proposer-A').bind(messageBroker);
    new ProposerNode('Proposer-B').bind(messageBroker);
    new ProposerNode('Proposer-C').bind(messageBroker);

    new AcceptorNode('Acceptor-X').bind(messageBroker);
    new AcceptorNode('Acceptor-Y').bind(messageBroker);
    new AcceptorNode('Acceptor-Z').bind(messageBroker);

    new LearnerNode('Learner-M').bind(messageBroker);
    new LearnerNode('Learner-N').bind(messageBroker);
  }

  controlUI() {
    return (
      <div>
        <h1>Basic Paxos</h1>
        <div>Open debug console to see log message. Keep clicking Tick for step-by-step progress.</div>
        <div>Proposers propose their names and learners see the eventual agreement.</div>
      </div>
    );
  }
}

export default Initializer;
