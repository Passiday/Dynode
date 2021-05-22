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

interface ValueConstructor<T> {
  new(value: T): Value<T>
}

class Value<T> {
  /**
   * Actual value that this class wraps.
   */
  private realValue: T;

  constructor(value: T) {
    if (!Value.check(value)) throw new Error('value does not belong to this class!');
    this.realValue = value;
  }

  get value(): T {
    return this.realValue;
  }

  set value(val: T) {
    if (!Value.check(val)) throw new Error('value does not belong to this class!');
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

export { Value, ValueConstructor };
