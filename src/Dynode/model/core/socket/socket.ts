import { VEvent, VEventTarget } from 'src/utils/vanillaEvent';
import { JsonValue } from 'src/utils/objectUtils';
import ValueType from './valueType';

/**
 * Class for dealing with Node values.
 */
class Socket extends VEventTarget {
  /**
   * The ValueType name of the socket.
   */
  protected typeObject: ValueType | null = null;

  /**
   * The stored value.
   */
  value: unknown;

  /**
   * Denotes whether the stored value is equal to nothing.
   */
  nothing = false;

  /**
   * Denotes whether the object holds a value.
   */
  hasValue = false;

  /**
   * Identifier used to retrieve the socket.
   */
  name: string | null = null ;

  /**
   * A name used for display.
   */
  title: string | null = null;

  constructor(typeObject?: ValueType) {
    super();
    if (typeObject) this.typeObject = typeObject;
    this.declareEvents(['value']);
    this.reset();
  }

  /**
   * Initialize the socket for clean run.
   */
  init(): void {
    this.reset();
  }

  /**
   * Object's setup/reset.
   */
  reset(): void {
    this.value = undefined;
    this.nothing = false;
    this.hasValue = false;
  }

  /**
   * Object's setter for {@link value}
   */
  setValue(value?: unknown): void {
    if (this.hasValue) throw Error('Value already set');
    if (arguments.length) {
      if (this.typeObject !== null && !this.typeObject.check(value)) {
        throw Error(`${value} is not of ${this.typeObject}`);
      }
      this.value = value;
    } else {
      this.nothing = true;
    }
    this.hasValue = true;
    this.dispatchEvent(new VEvent('value'));
  }

  /**
   * Object's getter for {@link value}
   */
  getValue(): unknown {
    if (!this.hasValue) throw Error('Socket is not set');
    if (this.nothing) throw Error('Socket has no value');
    return this.value;
  }

  /**
   * Get {@link value} as a JSON-compatible object
   */
  getJsonValue(): JsonValue {
    if (this.typeObject === null) throw Error('Socket has no associated type');
    return this.typeObject.toJson(this.getValue());
  }

  /**
   * Denotes whether the object's value has been set.
   */
  isSet(): boolean {
    return this.hasValue;
  }

  /**
   * Denotes whether the object's value is set to nothing.
   */
  isNothing(): boolean {
    return this.hasValue && this.nothing;
  }
}

export default Socket;
