import Socket from './socket';
import type Node from './node';
import type ValueType from './valueType';

/**
 * Socket class that handles output.
 */
class OutputSocket extends Socket {
  /**
   * Mark whether the object is awaiting output.
   */
  waiting = false;

  /**
   * Reference to a node that is responsible for this object.
   */
  parent: Node;

  /**
   * @param parentNode  See {@link parent}
   */
  constructor(parentNode: Node, typeObject?: ValueType) {
    super();
    this.parent = parentNode;
    if (typeObject) this.typeObject = typeObject;
  }

  /**
   * Ask {@link parent} to resolve.
   */
  pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    this.parent.resolve();
  }

  /**
   * Initialize the socket.
   */
  init(): void {
    super.init();
    this.waiting = false;
  }

  /**
   * Object's setter.
   *
   * @param value  The new value. If omitted, value is set to nothing.
   */
  setValue(value?: unknown): void {
    this.waiting = false;
    if (arguments.length) {
      super.setValue(value);
    } else {
      super.setValue();
    }
  }
}

export default OutputSocket;
