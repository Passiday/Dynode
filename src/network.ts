import Node from './node';
import { VEventTarget, VEvent } from './vanillaEvent';

class Network extends VEventTarget {
  nodes: Node[];

  name: string; // Name is (currently) used to discern different networks in console logs

  constructor(name = 'network') {
    super();
    this.nodes = [];
    this.name = name;
  }

  addNode(node: Node): Node {
    this.nodes.push(node);
    this.dispatchEvent(new VEvent('addNode', { detail: { node } }));
    return node;
  }

  removeNode(node: Node): void {
    const index = this.nodes.indexOf(node);
    if (index === -1) throw Error(`Network doesn't contain node ${node}`);
    node.dispatchEvent(new VEvent('nodeRemoved'));
    this.nodes.splice(index, 1);
  }

  resolve(): void {
    console.log(`--- ${this.name} ---`);
    this.nodes.forEach((node) => node.resolve());
    this.dispatchEvent(new VEvent('resolve'));
  }
}

export default Network;
