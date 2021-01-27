import MessageOp from '../MessageOp';

/*
Heart beat is sent by servers to watchers.
*/
class BeatOp extends MessageOp {
  execute(node, tickNumber) {
    node.gotBeatFrom(this.from, tickNumber);
  }
}

export default BeatOp;
