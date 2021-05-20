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

class Value<T> {
  /**
   * Actual value that this class wraps.
   */
  private realValue: T | undefined;

  /**
   * Denotes whether the stored value is nothing.
   */
  private nothing: boolean;

  constructor(value?: T) {
    if (value === undefined) {
      this.nothing = true;
      this.realValue = undefined;
    } else {
      this.nothing = false;
      if (!Value.check(value)) throw new Error('value does not belong to this class!');
      this.realValue = value;
    }
  }

  get value(): T {
    if (this.isNothing()) throw new Error('"nothing" cannot be retrieved!');
    if (this.realValue === undefined) throw new Error('value is undefined!');
    return this.realValue;
  }

  set value(val: T) {
    if (!Value.check(val)) throw new Error('value does not belong to this class!');
    this.realValue = val;
  }

  /**
   * Set the value to "nothing".
   */
  setNothing(): void {
    this.realValue = undefined;
    this.nothing = true;
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
   * Denotes whether the object's value is set to nothing.
   */
  public isNothing() {
    return this.nothing;
  }

  /**
   * Converter that turns value to a JsonValue.
   */
  public toJSON(): JsonValue {
    if (this.isNothing()) throw new Error('"nothing" cannot be serialized!');
    if (this.realValue === undefined) throw new Error('value is undefined!');
    return this.realValue;
  }
}

export default Value;
