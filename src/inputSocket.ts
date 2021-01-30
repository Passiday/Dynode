import OutputSocket from './outputSocket';
import Socket from './socket';
import { VEventHandler, VEvent } from './vanillaEvent';

class InputSocket extends Socket {
  defaultValue: unknown;

  defaultNothing = false;

  hasDefault = false;

  linkedSocket: OutputSocket | undefined;

  valueHandler: VEventHandler | undefined;

  setDefaultValue(value?: unknown): void {
    if (arguments.length) {
      this.defaultValue = value;
      this.defaultNothing = false;
    } else {
      this.defaultNothing = true;
    }
  }

  getDefaultValue(): unknown {
    if (!this.hasDefault) throw Error('Input socket has no default value set');
    if (this.defaultNothing) throw Error('Input socket default is nothing');
    return this.defaultValue;
  }

  isDefaultNothing() : boolean {
    if (!this.hasDefault) throw Error('Input socket has no default value set');
    return this.defaultNothing;
  }

  clearDefault(): void {
    this.hasDefault = false;
  }

  isValid(): boolean {
    return this.linkedSocket ? true : this.hasDefault;
  }

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

  clearLink(): void {
    if (this.linkedSocket === undefined) throw Error('linkedSocket is undefined');
    if (this.valueHandler === undefined) throw Error('valueHandler is undefined');
    this.linkedSocket.removeEventListener('value', this.valueHandler);
    this.linkedSocket = undefined;
  }

  pull(): void {
    if (!this.linkedSocket) throw new Error('Input socket is not linked.');
    this.linkedSocket.pull();
  }

  getValue(): unknown {
    if (this.linkedSocket) {
      return super.getValue();
    }
    return this.getDefaultValue();
  }

  isSet(): boolean {
    if (this.linkedSocket) {
      return super.isSet();
    }
    return this.hasDefault;
  }

  isNothing(): boolean {
    if (this.linkedSocket) {
      return super.isNothing();
    }
    return this.isDefaultNothing();
  }
}

export default InputSocket;
