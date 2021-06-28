import type { Node } from 'src/Dynode/model/core';
import Socket from './socket';
import { SocketValue, SocketValueType } from './value';

/**
 * Socket class that handles output.
 */
class OutputSocket<T> extends Socket<T> {
  /**
   * The {@link parent} is asked to resolve and socket is waiting to be set.
   */
  private waiting = false;

  /**
   * Reference to a node that is responsible for setting this socket.
   */
  private parent: Node;

  /**
   * A special mode for the OutputSocket class.
   * StorageMode is used for networks with loops,
   * it allows nodes to pass values between network step.
   */
  private storageMode = false;

  /**
   * The stored value of the socket, when operating in the storage mode.
   */
  private storedValue: SocketValue<T> | null;

  /**
   * @param parentNode  See {@link parent}
   * @param storageMode Option to enable StorageMode
   */
  constructor(parentNode: Node, socketValueType?: SocketValueType<T>, storageMode?: boolean) {
    super(socketValueType);
    this.parent = parentNode;
    this.storedValue = this.socketValue;
    if (storageMode !== undefined) this.storageMode = storageMode;
  }

  /**
   * Trigger the process that will eventually set this socket.
   */
  public pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    if (!this.storageMode) {
      // Operating in the default mode: ask the parent to resolve and thus set this socket.
      this.parent.resolve();
      return;
    }
    // Operating in the storage mode: set the stocket with its stored state (value or nothing).
    // Note that this means that pulling at a storage-mode socket will not trigger it's parent node
    // resolving. If all of node's outputs are storage-mode sockets, it will automatically resolve
    // when the last of its inputs is set. If such node has zero inputs, it will never resolve.
    if (this.isSet()) return;
    if (this.isStoredNothing()) super.setNothing();
    // Can be cast because it's not nothing
    else super.setValue((this.storedValue as SocketValue<T>).value);
  }

  /**
   * Prepare the socket for the next step.
   */
  public clear(): void {
    super.clear();
    this.waiting = false;
  }

  /**
   * Prepare the socket for the first step.
   */
  public reset(): void {
    this.clear();
    this.storedValue = null;
  }

  /**
   * Set the socket's state to the given value.
   * When operating in the storage mode, the socket will emit the stored value and set the stored
   * state to the given value.
   *
   * @param value  The new value.
   */
  public setValue(value: T): void {
    this.waiting = false;
    if (this.storageMode) {
      this.pull();
      this.storedValue = new this.SocketValueType(value);
    } else {
      super.setValue(value);
    }
  }

  /**
   * Set the socket's state to nothing.
   * When operating in the storage mode, the socket will emit the stored value and set the stored
   * state to nothing.
   */
  public setNothing(): void {
    this.waiting = false;
    if (this.storageMode) {
      this.pull();
      this.storedValue = null;
    } else {
      super.setNothing();
    }
  }

  /**
   * Denotes whether the socket's stored state is nothing.
   */
  public isStoredNothing(): boolean {
    return this.storedValue === null;
  }

  /**
   * Returns the socket's stored value.
   * Throws error if the socket's stored state is nothing.
   */
  public getStoredValue(): T {
    if (this.isStoredNothing()) throw Error('Socket has no value stored');
    // Can be cast because it's not nothing
    return (this.storedValue as SocketValue<T>).value;
  }

  /**
   * Denotes whether the socket operates in the storage mode.
   * @returns True if the socket operates in the storage mode, false otherwise.
   */
  public isStorage(): boolean {
    return this.storageMode;
  }

  /**
   * Return the state of {@link waiting}
   */
  public isWaiting(): boolean {
    return this.waiting;
  }
}

export default OutputSocket;
