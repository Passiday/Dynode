import Node from './node';
import { VEventTarget, VEvent } from './vanillaEvent';

/**
 * Class that orchestrates nodes.
 */
class Network extends VEventTarget {
  /**
   * A collection of nodes that belong to this object.
   */
  nodes: Node[];

  /**
   * Identifier to differentiate from other networks.
   */
  name: string;

  /**
   * Denotes whether the network is not available.
   */
  busy = false;

  /**
   * Denotes whether the network has finished.
   */
  resolved = false;

  /**
   * @param name  See {@link name}.
   */
  constructor(name = 'network') {
    super();
    this.nodes = [];
    this.name = name;
  }

  /**
   * Attach a node to this object.
   *
   * @param node  Node that is going to be attached.
   * @return Node that has been passed.
   */
  addNode(node: Node): Node {
    this.nodes.push(node);
    this.dispatchEvent(new VEvent('addNode', { detail: { node } }));
    return node;
  }

  /**
   * Detach a node from this object.
   *
   * @param node  Reference to an object that is going to be removed.
   */
  removeNode(node: Node): void {
    const index = this.nodes.indexOf(node);
    if (index === -1) throw Error(`Network doesn't contain node ${node}`);
    node.dispatchEvent(new VEvent('nodeRemoved'));
    this.nodes.splice(index, 1);
  }

  /**
   * Resolve all the nodes in the network.
   */
  resolve(): void {
    console.log(`--- ${this.name} ---`);
    this.nodes.forEach((node) => node.preResolve());
    this.nodes.forEach((node) => node.resolve());
    this.dispatchEvent(new VEvent('resolve'));
  }

  /**
   *
   * @returns Boolean that states if at least one node has a live state
   */
  step(): boolean {
    this.resolve();
    return this.nodes.some((node) => node.resetState === false);
  }
}

export default Network;
