import Node from '../Node';

/*
Learner hold a list of accepted values from each acceptor.
During progress acceptors may change they votes, but eventually
they will all get the same one.
*/
class LearnerNode extends Node {
  constructor(name) {
    super(name, 'learner');
    this.state['acceptedValues'] = {};
  }
}

export default LearnerNode;
