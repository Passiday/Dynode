/* eslint class-methods-use-this: off */
import { Value } from '../core/socket';

class Number extends Value<number> {
  public check(value: unknown): boolean {
    return Value.check(value) && typeof value === 'number';
  }
}

class Boolean extends Value<boolean> {
  public check(value: unknown): boolean {
    return Value.check(value) && typeof value === 'boolean';
  }
}

class String extends Value<string> {
  public check(value: unknown): boolean {
    return Value.check(value) && typeof value === 'string';
  }
}

export {
  Number,
  Boolean,
  String,
};
