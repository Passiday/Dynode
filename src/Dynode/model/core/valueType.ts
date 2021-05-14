import { JsonValue } from './objectUtils';

interface CheckFunc {
  (value: unknown): boolean;
}

interface ToJsonFunc {
  (value: unknown): JsonValue;
}

class ValueType {
  /**
   * String representation of the value type.
   */
  private innerName: string;

  constructor(name: string, check: CheckFunc, toJson: ToJsonFunc) {
    this.innerName = name;
    this.check = check;
    this.toJson = toJson;
  }

  get name(): string {
    return this.innerName;
  }

  /**
   * Validator that ensures that a value belongs to this type.
   *
   * @param value  Variable to check.
   */
  readonly check: CheckFunc;

  readonly toJson: ToJsonFunc;
}

export default ValueType;
