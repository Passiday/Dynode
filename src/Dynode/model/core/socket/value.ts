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

class Value {
  private value: JsonValue;

  private nothing: boolean;

  constructor(value?: unknown) {
    if (arguments.length) {
      this.nothing = true;
      this.value = null; // Placeholder
    } else {
      this.nothing = false;
      this.value = value as JsonValue;
      if (!Value.check(this.toJSON())) throw new Error('Value is not JSONifiable!');
    }
  }

  /**
   * Validator that ensures that a value belongs to this type.
   *
   * @param value  Variable to check.
   */
  public static check(value: unknown): boolean {
    return isJSON(value);
  }

  public isNothing() {
    return this.nothing;
  }
  /**
   * Converter that turns value to a JsonValue.
   */
  public toJSON(): JsonValue {
    if (this.isNothing()) throw new Error('"nothing" cannot be serialized!');
    return this.value;
  }
}

export default Value;