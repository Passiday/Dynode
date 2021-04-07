import Socket from './socket';
import type Node from './node';
import { VEvent } from './vanillaEvent';

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
  storageMode = false;

  /**
   * @param parentNode  See {@link parent}
   */
  constructor(parentNode: Node, storageMode?: boolean) {
    super();
    this.parent = parentNode;
    if (storageMode !== undefined) this.storageMode = storageMode;
  }

  /**
   * Ask {@link parent} to resolve.
   */
  pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    if (!this.storageMode) { this.parent.resolve(); return; }
    if (this.storedNothing) super.setValue();
    else super.setValue(this.storedValue);
    this.dispatchEvent(new VEvent('value'));
  }

  /**
   * Initialize the socket.
   */
  init(): void {
    super.init();
    this.waiting = false;
    this.storedValue = undefined;
    this.storedNothing = true;
  }

  /**
   * Resets the socket, keeping the storedValue
   */
  reset(): void {
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
}

export default OutputSocket;
