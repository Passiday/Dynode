import Socket from './socket';
import type Node from './node';

/**
 * Socket class that handles output.
 */
class OutputSocket extends Socket {
  /**
   * Mark whether the object is awaiting output.
   */
  waiting = false;

  tempValue: unknown;

  pull(): void {
    if (this.waiting) return;
    this.waiting = true;
  }

  /**
   * Initialize the socket.
   */
  init(): void {
    super.init();
    this.waiting = false;
    super.setValue(this.tempValue);
  }

  /**
   * Object's setter.
   *
   * @param value  The new value. If omitted, value is set to nothing.
   */
  setValue(value?: unknown): void {
    this.waiting = false;
    if (arguments.length) {
      this.tempValue = value;
    } else {
      this.tempValue = undefined;
    }
  }
}

export default OutputSocket;
