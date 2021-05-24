import type { Node } from 'src/Dynode/model/core';
import Socket from './socket';
import { SocketValue, SocketValueType } from './value';

/**
 * Socket class that handles output.
 */
class OutputSocket<T> extends Socket<T> {
  /**
   * Mark whether the object is awaiting output.
   */
  private waiting = false;

  /**
   * Reference to a node that is responsible for this object.
   */
  private parent: Node;

  /**
   * The Stored Value of the socket, will be pulled after the next network resolve.
   */
  private storedValue: SocketValue<T> | null;

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
  constructor(
    parentNode: Node, value?: T, socketValueType?: SocketValueType<T>, storageMode?: boolean,
  ) {
    super(value, socketValueType);
    this.parent = parentNode;
    this.storedValue = this.socketValue;
    if (storageMode !== undefined) this.storageMode = storageMode;
  }

  /**
   * Ask {@link parent} to resolve.
   */
  public pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    if (!this.storageMode) { this.parent.resolve(); return; }
    if (this.isSet()) return;
    if (this.isStoredNothing()) super.setNothing();
    // Can be cast because it's not nothing
    else super.setValue((this.storedValue as SocketValue<T>).value);
  }

  public clear(): void {
    super.clear();
    this.waiting = false;
  }

  public reset(): void {
    this.clear();
    this.storedValue = null;
  }

  /**
   * Object's setter.
   *
   * @param value  The new value. If omitted, value is set to nothing.
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
   * Denotes whether the object's stored value is set to nothing.
   */
  public isStoredNothing(): boolean {
    return this.storedValue === null;
  }

  /**
   * Denotes whether the OutputSocket has Storage Mode turned on or off.
   * @returns True if the network has Storage Mode turned on, false otherwise.
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
