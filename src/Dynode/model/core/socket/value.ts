import { JsonValue } from 'src/utils/objectUtils';

function isJSON(value: unknown): boolean {
  if (value === null) return true;
  if (typeof value === 'number') return !(isNaN(value) || [Infinity, -Infinity].includes(value));
  if (['string', 'boolean'].includes(typeof value)) return true;
  if (typeof value === 'object' && value) {
    for (const [k, v] of Object.entries(value)) {
      if (typeof k !== 'string') return false;
      if (!isJSON(v)) return false;
    }
    return true;
  } else {
    return false;
  }
}

interface SocketValueType<T> {
  new(value: T): SocketValue<T>
}

class SocketValue<T> {
  /**
   * Actual value that this class wraps.
   */
  protected realValue: T;

  constructor(value: T) {
    if (!(this.constructor as typeof SocketValue).check(value)) {
      throw new Error(`value <${value}> does not belong to this class!`);
    }
    this.realValue = value;
  }

  get value(): T {
    return this.realValue;
  }

  set value(val: T) {
    if (!(this.constructor as typeof SocketValue).check(val)) {
      throw new Error('value does not belong to this class!');
    }
    this.realValue = val;
  }

  /**
   * Validator that ensures that a value belongs to this type.
   *
   * @param value  Variable to check.
   */
  public static check(value: unknown): boolean {
    return isJSON(value);
  }

  /**
   * Converter that turns value to a JsonValue.
   */
  public toJSON(): JsonValue {
    return this.realValue;
  }
}

export { SocketValue, SocketValueType };
