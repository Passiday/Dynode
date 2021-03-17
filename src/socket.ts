import { VEvent, VEventTarget } from './vanillaEvent';

/**
 * Class for dealing with Node values.
 */
class Socket extends VEventTarget {
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
   * A name used to retrieve the socket.
   */
  accessName: string | null = null ;

  /**
   * A name used for display.
   */
  humanReadableName: string | null = null;

  constructor() {
    super();
    this.init();
  }

  /**
   * Object's setup.
   */
  init(): void {
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
