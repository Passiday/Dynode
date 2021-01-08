import Node from './node'

class Link {
  // HeadNode and outputN are attributes of the origin node
  // TailNode and inputN are attributes of the target node
  headNode: Node;
  tailNode: Node;
  outputN: number;
  inputN: number;
  constructor(headNode: Node, tailNode: Node, outputN: number, inputN: number) {
    this.headNode = headNode;
    this.tailNode = tailNode;
    this.outputN = outputN;
    this.inputN = inputN;
  }

  update() {
    (this.tailNode as any).setInput((this.headNode as any).getOutput(this.outputN), this.inputN);
  }
}

export default Link