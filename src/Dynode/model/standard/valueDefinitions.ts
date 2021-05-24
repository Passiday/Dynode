/* eslint class-methods-use-this: off */
import { SocketValue } from '../core/socket';

class Number extends SocketValue<number> {
  public check(value: unknown): boolean {
    return SocketValue.check(value) && typeof value === 'number';
  }
}

class Boolean extends SocketValue<boolean> {
  public check(value: unknown): boolean {
    return SocketValue.check(value) && typeof value === 'boolean';
  }
}

class String extends SocketValue<string> {
  public check(value: unknown): boolean {
    return SocketValue.check(value) && typeof value === 'string';
  }
}

export {
  Number,
  Boolean,
  String,
};
