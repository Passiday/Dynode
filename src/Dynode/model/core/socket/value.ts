import { JsonValue } from 'src/utils/objectUtils';

function isJSON(value: unknown): boolean {
  if (value === null) return true;
  if ((typeof value) in ['string', 'number', 'boolean']) return true;
  if (typeof value === 'object' && value) {
    for (const [k, v] of Object.entries(value)) {
      if (typeof k !== 'string') return false;
      if (!isJSON(v)) return false;
    }
  }
  return true;
}

interface SocketValueType<T> {
  new(value: T): SocketValue<T>
}

class SocketValue<T> {
  /**
   * Actual value that this class wraps.
   */
  private realValue: T;

  constructor(value: T) {
    if (!SocketValue.check(value)) throw new Error('value does not belong to this class!');
    this.realValue = value;
  }

  get value(): T {
    return this.realValue;
  }

  set value(val: T) {
    if (!SocketValue.check(val)) throw new Error('value does not belong to this class!');
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
