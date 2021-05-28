import { VEventTarget, VEvent } from 'src/utils/vanillaEvent';
import Node from './node';
import Engine from './engine';

/**
 * Class that orchestrates nodes.
 */
class Network extends VEventTarget {
  /**
   * Engine instance where this network belongs to.
   */
  public engine: Engine | null;

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
   * Denotes whether the multi cycle network needs another resolve call.
   * Another resolve call is needed if halted is false.
   */
  private halted = false;

  /**
   * @param name  See {@link name}.
   */
  constructor(name = 'network', engine?: Engine) {
    super(); // VEventTarget
    this.nodes = [];
    this.engine = engine || null;
    this.name = name;
    this.declareEvents(['nodeRemoved', 'addNode', 'afterResolve', 'log', 'error']);
    this.init();
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
   * Initialize the network for clean run.
   */
  init(): void {
    this.halted = false;
    this.reset();
    this.nodes.forEach((node) => node.init());
  }

  /**
   * Prepare network for resolving.
   */
  reset(): void {
    this.busy = false;
    this.resolved = false;
    this.nodes.forEach((node) => node.reset());
  }

  /**
   * Resolve all nodes in the network.
   */
  resolve(): Promise<void> {
    return new Promise<void>((pResolve, pReject) => {
      if (this.busy) {
        pReject(new Error('Network busy'));
        return;
      }
      if (this.isHalted()) {
        pReject(new Error('Network halted'));
        return;
      }
      this.reset();
      this.busy = true;
      this.log(`Resolving newtork ${this.name}`);
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

  /**
   * Method that can be used by the nodes in the network.
   * It is used to state, that the multi cycle network doesn't need another resolve method call.
   */
  halt(): void {
    this.halted = true;
  }

  /**
   * @returns this.halted
   */
  isHalted(): boolean {
    return this.halted;
  }
}

export default Network;
