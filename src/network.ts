import Node from './node';

class Network {
  nodes: Node[];

  name: string; // Name is (currently) used to discern different networks in console logs

  constructor(name = 'network') {
    this.nodes = [];
    this.name = name;
  }

  addNode(node: Node): Node {
    this.nodes.push(node);
    return node;
  }

  resolve(): void {
    console.log(`--- ${this.name} ---`);
    this.nodes.forEach((node) => node.resolve());
  }
}

export default Network;
