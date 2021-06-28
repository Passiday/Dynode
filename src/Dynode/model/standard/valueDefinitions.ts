/* eslint class-methods-use-this: off */
import { JsonValue } from 'src/utils/objectUtils';
import { SocketValue } from '../core/socket';

class NumberValue extends SocketValue<number> {
  public static check(value: unknown): boolean {
    return typeof value === 'number';
  }

  public toJSON(): JsonValue {
    if (Number.isNaN(this.realValue) || [Infinity, -Infinity].includes(this.realValue)) {
      return {
        special: this.realValue.toString(),
      };
    }
    return { normal: this.realValue };
  }
}

class BooleanValue extends SocketValue<boolean> {
  public check(value: unknown): boolean {
    return SocketValue.check(value) && typeof value === 'boolean';
  }
}

class StringValue extends SocketValue<string> {
  public check(value: unknown): boolean {
    return SocketValue.check(value) && typeof value === 'string';
  }
}

export {
  NumberValue as Number,
  BooleanValue as Boolean,
  StringValue as String,
};
