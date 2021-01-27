import MessageOp from './MessageOp'

/*
Operaion doing nothing other than consuming one tick.
*/
class NoOpMessage extends MessageOp {
  execute(node, tickNumber) {
    console.log(`NoOp message from ${this.from}`);
  }
}

export default NoOpMessage;
