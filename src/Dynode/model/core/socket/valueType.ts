import { JsonValue } from 'src/utils/objectUtils';

abstract class ValueType {
  /**
   * Validator that ensures that a value belongs to this type.
   *
   * @param value  Variable to check.
   */
  public abstract check(value: unknown): boolean;

  /**
   * Converter that turns value to a JsonValue.
   */
  public abstract toJson(value: unknown): JsonValue;
}

export default ValueType;
