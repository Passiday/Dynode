import OutputSocket from './outputSocket';
import Socket from './socket';
import { VEventHandler, VEvent } from './vanillaEvent';

/**
 * Socket class that handles inputs.
 */
class InputSocket extends Socket {
  /**
   * Value used if the socket doesn't have a socket linked to it.
   */
  defaultValue: unknown;

  /**
   * If true, mark socket's default to be nothing.
   */
  defaultNothing = false;

  /**
   * Marks whether socket can have a default value.
   */
  hasDefault = false;

  /**
   * Reference to the socket that is connected to the input.
   */
  linkedSocket: OutputSocket | undefined;

  /**
   * Function that handles setting the value.
   */
  valueHandler: VEventHandler | undefined;

  /**
   * Provide a default value to socket.
   *
   * @param value  The new value. If omitted, defaultValue is set to nothing.
   */
  setDefaultValue(value?: unknown): void {
    if (arguments.length) {
      this.defaultValue = value;
      this.defaultNothing = false;
    } else {
      this.defaultNothing = true;
    }
    this.hasDefault = true;
  }

  /**
   * Receive the default value that is set on the object.
   */
  getDefaultValue(): unknown {
    if (!this.hasDefault) throw Error('Input socket has no default value set');
    if (this.defaultNothing) throw Error('Input socket default is nothing');
    return this.defaultValue;
  }

  /**
   * Check whether object's default value is set to nothing.
   */
  isDefaultNothing() : boolean {
    if (!this.hasDefault) throw Error('Input socket has no default value set');
    return this.defaultNothing;
  }

  /**
   * Unset object's default value.
   */
  clearDefault(): void {
    this.hasDefault = false;
  }

  /**
   * Check if the object's state is valid.
   */
  isValid(): boolean {
    return this.linkedSocket ? true : this.hasDefault;
  }

  /**
   * Connect an OutputSocket object to the object.
   *
   * @param socket  An object that will be connected.
   */
  linkSocket(socket: OutputSocket): void {
    this.linkedSocket = socket;
    this.valueHandler = (e: VEvent) => {
      if (e.target === undefined) throw Error('VEvent target is undefined');
      if (!(e.target instanceof Socket)) throw Error('VEvent target is not a socket');
      if (e.target.isNothing()) {
        this.setValue();
      } else {
        this.setValue(e.target.getValue());
      }
    };
    this.linkedSocket.addEventListener('value', this.valueHandler);
  }

  /**
   * Unlink the connected socket.
   */
  clearLink(): void {
    if (this.linkedSocket === undefined) throw Error('linkedSocket is undefined');
    if (this.valueHandler === undefined) throw Error('valueHandler is undefined');
    this.linkedSocket.removeEventListener('value', this.valueHandler);
    this.linkedSocket = undefined;
  }

  /**
   * Ask {@link linkedSocket} for output.
   */
  pull(): void {
    if (!this.linkedSocket) throw new Error('Input socket is not linked.');
    this.linkedSocket.pull();
  }

  /**
   * Receive object's stored value.
   */
  getValue(): unknown {
    if (this.linkedSocket) {
      return super.getValue();
    }
    return this.getDefaultValue();
  }

  /**
   * Check if object has a set value.
   */
  isSet(): boolean {
    if (this.linkedSocket) {
      return super.isSet();
    }
    return this.hasDefault;
  }

  /**
   * Check if the object's value is set to nothing.
   */
  isNothing(): boolean {
    if (this.linkedSocket) {
      return super.isNothing();
    }
    return this.isDefaultNothing();
  }
}

export default InputSocket;
