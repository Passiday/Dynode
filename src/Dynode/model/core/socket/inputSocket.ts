import { VEventHandler, VEvent } from 'src/utils/vanillaEvent';
import OutputSocket from './outputSocket';
import Socket from './socket';
import { SocketValue } from './value';

/**
 * Socket class that handles inputs.
 */
class InputSocket<T> extends Socket<T> {
  /**
   * Value used if the socket doesn't have a socket linked to it. null means there is nothing.
   */
  private defaultValue: SocketValue<T> | null = null;

  /**
   * Marks whether socket can have a default value.
   */
  private isDefaultSetVariable = false;

  /**
   * Reference to the socket that is connected to the input.
   */
  private linkedSocket: OutputSocket<T> | undefined;

  /**
   * Function that handles setting the value.
   */
  private valueHandler: VEventHandler | undefined;

  /**
   * Provide a default value to socket.
   *
   * @param value  The new value. If omitted, defaultValue is set to nothing.
   */
  public setDefaultValue(value: T): void {
    this.defaultValue = new this.SocketValueType(value);
    this.isDefaultSetVariable = true;
  }

  /**
   * Receive the default value that is set on the object.
   */
  public getDefaultValue(): T {
    // No need to check this.isDefaultSet because it's handled by this.isDefaultNothing
    if (this.isDefaultNothing()) throw Error('Input socket default is nothing');
    return (this.defaultValue as SocketValue<T>).value; // Can be cast because of "nothing" check
  }

  public setDefaultNothing(): void {
    this.defaultValue = null;
    this.isDefaultSetVariable = true;
  }

  /**
   * Check whether object's default value is set to nothing.
   */
  public isDefaultNothing(): boolean {
    if (!this.isDefaultSet) throw Error('Input socket has no default value set');
    return this.defaultValue === null;
  }

  /**
   * Unset object's default value.
   */
  public clearDefault(): void {
    this.isDefaultSetVariable = false;
  }

  /**
   * Check if the object's state is valid.
   */
  public isValid(): boolean {
    return this.linkedSocket ? true : this.isDefaultSet();
  }

  /**
   * Connect an OutputSocket object to the object.
   *
   * @param socket  An object that will be connected.
   */
  public linkSocket(socket: OutputSocket<T>): void {
    this.linkedSocket = socket;
    this.valueHandler = (e: VEvent) => {
      if (e.target === undefined) throw Error('VEvent target is undefined');
      if (!(e.target instanceof Socket)) throw Error('VEvent target is not a socket');
      if (e.target.isNothing()) {
        this.setNothing();
      } else {
        this.setValue(e.target.getValue().value);
      }
    };
    this.linkedSocket.addEventListener('value', this.valueHandler);
  }

  /**
   * Unlink the connected socket.
   */
  public clearLink(): void {
    if (this.linkedSocket === undefined) throw Error('linkedSocket is undefined');
    if (this.valueHandler === undefined) throw Error('valueHandler is undefined');
    this.linkedSocket.removeEventListener('value', this.valueHandler);
    this.linkedSocket = undefined;
  }

  /**
   * Ask {@link linkedSocket} for output.
   */
  public pull(): void {
    if (!this.linkedSocket) throw new Error('Input socket is not linked.');
    this.linkedSocket.pull();
  }

  /**
   * Receive object's stored value.
   */
  public getValue(): T {
    if (this.linkedSocket) {
      return super.getValue();
    }
    return this.getDefaultValue();
  }

  /**
   * Check if object has a set value.
   */
  public isSet(): boolean {
    if (this.linkedSocket) {
      return super.isSet();
    }
    return this.isDefaultSet();
  }

  /**
   * Check if the object's value is set to nothing.
   */
  public isNothing(): boolean {
    if (this.linkedSocket) {
      return super.isNothing();
    }
    return this.isDefaultNothing();
  }

  public isDefaultSet(): boolean {
    return this.isDefaultSetVariable;
  }
}

export default InputSocket;
