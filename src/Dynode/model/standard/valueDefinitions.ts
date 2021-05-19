/* eslint class-methods-use-this: off */
import { JsonValue } from 'src/utils/objectUtils';
import { Value } from '../core/socket';

class Number extends Value {
  public check(value: unknown): boolean {
    return super.check(value) && typeof value === 'number';
  }

  public toJSON(value: unknown): JsonValue {
    return super.toJSON(value) as number;
  }
}

class Boolean extends Value {
  public check(value: unknown): boolean {
    return super.check(value) && typeof value === 'boolean';
  }

  public toJSON(value: unknown): JsonValue {
    return super.toJSON(value) as boolean;
  }
}

class String extends Value {
  public check(value: unknown): boolean {
    return super.check(value) && typeof value === 'string';
  }

  public toJSON(value: unknown): JsonValue {
    return super.toJSON(value) as string;
  }
}

export {
  Number,
  Boolean,
  String,
};
