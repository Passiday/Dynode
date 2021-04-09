interface CheckFunc {
  (value: unknown): boolean;
}

class ValueType {
  /**
   * String representation of the value type.
   */
  private innerName: string;

  constructor(name: string, check: CheckFunc) {
    this.innerName = name;
    this.check = check;
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
}

export default ValueType;
