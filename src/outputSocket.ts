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
   * The Stored Value of the socket, will be pulled after the next network resolve.
   */
  storedValue: unknown;

  /**
   * Checks if the Socket stored nothing as a value;
   */
  storedNothing = true;

  /**
   * An unique mode for the OutputSocket class.
   * StorageMode is used for networks with loops,
   * it ensure that the state can be passed during the next network step.
   */
  private storageMode = false;

  /**
   * @param parentNode  See {@link parent}
   * @param storageMode Option to enable StorageMode
   */
  constructor(parentNode: Node, typeObject?: ValueType, storageMode?: boolean) {
    super();
    this.parent = parentNode;
    if (typeObject) this.typeObject = typeObject;
    if (storageMode !== undefined) this.storageMode = storageMode;
  }

  /**
   * Ask {@link parent} to resolve.
   */
  pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    if (!this.storageMode) { this.parent.resolve(); return; }
    if (this.isSet()) return;
    if (this.storedNothing) super.setValue();
    else super.setValue(this.storedValue);
  }

  /**
   * Initialize the socket.
   */
  init(): void {
    this.reset();
    this.storedValue = undefined;
    this.storedNothing = true;
  }

  /**
   * Resets the socket, keeping the storedValue
   */
  reset(): void {
    super.reset();
    this.waiting = false;
  }

  /**
   * Object's setter.
   *
   * @param value  The new value. If omitted, value is set to nothing.
   */
  setValue(value?: unknown): void {
    this.waiting = false;

    if (this.storageMode) {
      this.pull();
      if (arguments.length) {
        this.storedValue = value;
        this.storedNothing = false;
      } else {
        this.storedNothing = true;
      }
      return;
    }

    if (arguments.length) {
      super.setValue(value);
    } else {
      super.setValue();
    }
  }

  /**
   * Denotes whether the OutputSocket has Storage Mode turned on or off.
   * @returns True if the network has Storage Mode turned on, false otherwise.
   */
  isStorage(): boolean {
    return this.storageMode;
  }
}

export default OutputSocket;
