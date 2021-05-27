/* eslint class-methods-use-this: off */
import { SocketValue } from '../core/socket';

class Number extends SocketValue<number> {
  public static check(value: unknown): boolean {
    return typeof value === 'number';
  }

  public toJSON() {
    if (isNaN(this.realValue) || [Infinity, -Infinity].includes(this.realValue)) return {
      special: this.realValue.toString(),
    };
    return { normal: this.realValue };
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
