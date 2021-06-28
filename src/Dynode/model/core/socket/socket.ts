import { VEvent, VEventTarget } from 'src/utils/vanillaEvent';
import { SocketValue, SocketValueType } from './value';

/**
 * Class for dealing with Node values.
 */
class Socket<T> extends VEventTarget {
  /**
   * Constructor that is used to build {@link socketValue}
   */
  protected SocketValueType: SocketValueType<T>;

  /**
   * The Value of the socket. null means there is nothing.
   */
  protected socketValue: SocketValue<T> | null;

  /**
   * Denotes whether the socket's state has been set.
   *
   * If the socket's state has not been set, it's state can not be assumed to be nothing or equal
   * to specific value.
   * Only when setValue(value) or setNothing() is called, the socket's state is considered set.
   */
  private $isSet: boolean;

  /**
   * Identifier used to retrieve the socket.
   */
  public name: string | null = null ;

  /**
   * A name used for display.
   */
  public title: string | null = null;

  constructor(socketValueType?: SocketValueType<T>) {
    super();
    this.SocketValueType = socketValueType || SocketValue;
    this.declareEvents(['value']);
    this.socketValue = null;
    this.$isSet = false;
  }

  /**
   * Prepare the socket for the next step.
   */
  public clear(): void {
    this.socketValue = null;
    this.$isSet = false;
  }

  /**
   * Prepare the socket for the first step.
   *
   * While for this base class the reset() is identical to the clear(),
   * the distinction between clear() and reset() is used by subclasses.
   */
  public reset(): void {
    this.clear();
  }

  /**
   * Object's setter for {@link value}
   */
  public setValue(value: T): void {
    if (this.isSet()) throw Error('Value already set');
    this.socketValue = new this.SocketValueType(value);
    this.$isSet = true;
    this.dispatchEvent(new VEvent('value'));
  }

  /**
   * Remove value and thus setting value to nothing.
   */
  public setNothing(): void {
    this.socketValue = null;
    this.$isSet = true;
    this.dispatchEvent(new VEvent('value'));
  }

  /**
   * Retrieve this socket's socketValue.
   */
  public getSocketValue(): SocketValue<T> {
    if (!this.isSet()) throw Error('Socket is not set');
    if (this.isNothing()) throw Error('Socket has no value');
    return this.socketValue as SocketValue<T>; // Can be cast because of "nothing" check
  }

  /**
   * Retrieve this socket's value.
   */
  public getValue(): T {
    return this.getSocketValue().value;
  }

  /**
   * Denotes whether the socket's state is set to nothing or specific value.
   */
  public isSet(): boolean {
    return this.$isSet;
  }

  /**
   * Denotes whether the socket's state is nothing.
   */
  public isNothing(): boolean {
    return this.isSet() && (this.socketValue === null);
  }
}

export default Socket;
