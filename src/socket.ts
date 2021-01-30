import { VEvent, VEventTarget } from './vanillaEvent';

class Socket extends VEventTarget {
  value: unknown;

  nothing = false;

  hasValue = false;

  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.value = undefined;
    this.nothing = false;
    this.hasValue = false;
  }

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

  getValue(): unknown {
    if (!this.hasValue) throw Error('Socket is not set');
    if (this.nothing) throw Error('Socket has no value');
    return this.value;
  }

  isSet(): boolean {
    return this.hasValue;
  }

  isNothing(): boolean {
    return this.hasValue && this.nothing;
  }
}

export default Socket;
