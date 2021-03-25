import Node from './node';
import { VEventTarget, VEvent } from './vanillaEvent';
import Engine from './engine';

/**
 * Class that orchestrates nodes.
 */
class Network extends VEventTarget {
  /**
   * Engine instance where this network belongs to.
   */
  private engine: Engine | null;

  /**
   * A collection of nodes that belong to this object.
   */
  nodes: Node[];

  /**
   * Identifier to differentiate from other networks.
   */
  name: string;

  /**
   * @param name  See {@link name}.
   */
  constructor(name = 'network', engine?: Engine) {
    super();
    this.nodes = [];
    this.engine = engine || null;
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
    this.nodes.forEach((node) => node.resolve());
    this.dispatchEvent(new VEvent('resolve'));
  }
}

export default Network;
