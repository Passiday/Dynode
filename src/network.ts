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
   * Prepare network for resolving.
   */
  preResolve(): void {
    this.busy = false;
    this.resolved = false;
  }

  /**
   * Resolve all the nodes in the network.
   */
  resolve(): Promise<void> {
    const p = new Promise<void>((resolve, reject) => {
      if (this.busy) reject();
      this.busy = true;
      console.log(`--- ${this.name} ---`);
      if (!this.resolved) {
        this.nodes.forEach((node) => node.preResolve());
        this.nodes.forEach((node) => {
          const promis = node.resolve();
          if (promis instanceof Promise) {
            promis.then(() => {
              if (!(this.nodes.some((n) => !n.resolved))) {
                this.dispatchEvent(new VEvent('afterResolve'));
                resolve();
              }
            });
          }
        });
      } else {
        reject();
      }
    });
    return p;
  }

  /**
   *
   * @returns Boolean that states if at least one node has a state
   */
  step(): boolean {
    this.resolve();
    return this.hasState();
  }

  /**
   * Checks if the network has state.
   * @returns True if network has state, false if doesn't.
   */
  hasState(): boolean {
    if (!this.resolved) throw new Error('Network is not resolved');
    return this.nodes.some((node) => node.hasState());
  }
}

export default Network;
