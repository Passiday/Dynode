/* eslint class-methods-use-this: off */
import { JsonValue } from 'src/utils/objectUtils';
import { ValueType } from '../core/socket';

class Number extends ValueType {
  public check(value: unknown): boolean {
    return typeof value === 'number';
  }

  public toJSON(value: unknown): JsonValue {
    return value as number;
  }
}

class Boolean extends ValueType {
  public check(value: unknown): boolean {
    return typeof value === 'boolean';
  }

  public toJSON(value: unknown): JsonValue {
    return value as boolean;
  }
}

class String extends ValueType {
  public check(value: unknown): boolean {
    return typeof value === 'string';
  }

  public toJSON(value: unknown): JsonValue {
    return value as string;
  }
}

export {
  Number,
  Boolean,
  String,
};
