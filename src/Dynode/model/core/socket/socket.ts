import { VEvent, VEventTarget } from 'src/utils/vanillaEvent';
import { Value, ValueConstructor } from './value';

/**
 * Class for dealing with Node values.
 */
class Socket<T> extends VEventTarget {
  /**
   * ValueConstructor that is used to determine the type of value.
   */
  protected ValueType: ValueConstructor<T>;

  /**
   * The Value of the socket. null means there is nothing.
   */
  protected value: Value<T> | null;

  /**
   * Denotes whether the object's value has been set.
   *
   * Although it may seem that when value = null the value has not been set, that is not
   * the case. When value = null and isSetVariable = true it's an explicit signal that there
   * is no value.
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

  constructor(value?: T, ValueType?: ValueConstructor<T>) {
    super();
    this.ValueType = ValueType || Value;
    if (value !== undefined) {
      this.value = new this.ValueType(value);
      this.isSetVariable = true;
    } else {
      this.value = null;
      this.isSetVariable = false;
    }
  }

  /**
   * Throw away the stored value making the value unset.
   *
   * See {@link isSetVariable} on the difference between nothing and unset.
   */
  public clear(): void {
    this.value = null;
    this.isSetVariable = false;
  }

  /**
   * Revert socket to a fresh state.
   *
   * It is used for resetting the socket for a clean run for a network.
   */
  public reset(): void {
    this.clear();
  }

  /**
   * Object's setter for {@link value}
   */
  public setValue(value: T): void {
    if (this.isSet()) throw Error('Value already set');
    this.value = new this.ValueType(value);
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
    return this.isSet() && (this.value === null);
  }
}

export default Socket;
