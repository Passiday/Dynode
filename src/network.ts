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
   * Denotes whether the network is in process of being resolved.
   */
  busy = false;

  /**
   * Denotes whether the network has finished resolving.
   */
  resolved = false;

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
    const n = node;
    n.engine = this.engine;
    this.nodes.push(n);
    this.dispatchEvent(new VEvent('addNode', { detail: { n } }));
    return n;
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
    this.nodes.forEach((node) => node.preResolve());
  }

  /**
   * Resolve all the nodes in the network.
   */
  resolve(): Promise<void> {
    return new Promise<void>((pResolve, pReject) => {
      this.preResolve();
      if (this.busy) pReject();
      this.busy = true;
      this.log(`--- ${this.name} ---`);
      if (!this.resolved) {
        this.nodes.forEach((node) => {
          if (node.isResolved()) {
            if (this.nodes.some((n) => !n.isResolved())) return;
            this.resolved = true;
            this.busy = false;
            this.dispatchEvent(new VEvent('afterResolve'));
            pResolve();
          }
          const p = node.resolve();
          if (!(p instanceof Promise)) return;

          p.then(() => {
            // eslint-disable-next-line no-continue
            if (this.nodes.some((n) => !n.isResolved())) return;
            this.resolved = true;
            this.busy = false;
            this.dispatchEvent(new VEvent('afterResolve'));
            pResolve();
          });
        });
      } else {
        pReject();
      }
    });
  }

  log(...args: unknown[]): void {
    this.dispatchEvent(new VEvent('log', { detail: { args } }));
  }

  /**
   * Checks if the network has state.
   * @returns True if at least one node in the network has state, false if not.
   */
  hasState(): boolean {
    if (!this.resolved) throw new Error('Network is not resolved');
    return this.nodes.some((node) => node.hasState());
  }
}

export default Network;
