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
  value as JsonValue;
  return true;
}

interface WithToJSON {
  toJSON: () => JsonValue,
}

type JSONifiable = JsonValue | WithToJSON;

class Value<T extends JSONifiable> {
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
      this.realValue = value;
      if (!Value.check(this.toJSON())) throw new Error('value is not JSONifiable!');
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
    if (isJSON(this.realValue)) return this.realValue as JsonValue;
    return (this.realValue as WithToJSON).toJSON();
  }
}

export default Value;
