import { VEvent, VEventTarget } from 'src/utils/vanillaEvent';
import Value from './value';

/**
 * Class for dealing with Node values.
 */
class Socket<T> extends VEventTarget {
  /**
   * The Value of the socket. null means there is nothing.
   */
  protected value: Value<T> | null;

  /**
   * Denotes whether the object holds a value.
   */
  private isSetVariable: boolean;

  /**
   * Identifier used to retrieve the socket.
   */
  public name: string | null = null ;

  /**
   * A name used for display.
   */
  public title: string | null = null;

  constructor(value?: Value<T>) {
    super();
    if (value !== undefined) {
      this.value = value;
      this.isSetVariable = true;
    } else {
      this.value = null;
      this.isSetVariable = false;
    }
  }

  /**
   * Object's setup/reset.
   */
  public unset(): void {
    this.value = null;
    this.isSetVariable = false;
  }

  /**
   * Object's setter for {@link value}
   */
  public setValue(value: Value<T>): void {
    if (this.isSet()) throw Error('Value already set');
    this.value = value;
    this.isSetVariable = true;
    this.dispatchEvent(new VEvent('value'));
  }

  /**
   * Remove value and thus setting value to nothing.
   */
  public setNothing(): void {
    this.value = null;
    this.isSetVariable = true;
  }

  /**
   * Object's getter for {@link value}
   */
  public getValue(): Value<T> {
    if (!this.isSet()) throw Error('Socket is not set');
    if (this.isNothing()) throw Error('Socket has no value');
    return this.value as Value<T>; // Can be cast because of "nothing" check
  }

  /**
   * Denotes whether the object's value has been set.
   */
  public isSet(): boolean {
    return this.isSetVariable;
  }

  /**
   * Denotes whether the object's value is set to nothing.
   */
  public isNothing(): boolean {
    return this.isSet() && (this.value === null);;
  }
}

export default Socket;
