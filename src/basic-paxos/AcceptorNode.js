import Node from '../Node';

/*
Acceptor.
*/
class AcceptorNode extends Node {
  constructor(name) {
    super(name, 'acceptor');
    this.state['proposalNumber'] = 0;
    this.state['proposedBy'] = '';
  }

}

export default AcceptorNode;
