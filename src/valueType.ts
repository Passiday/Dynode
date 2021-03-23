abstract class ValueType {
  /**
   * String representation of the value type.
   */
  private innerName: string;

  constructor(name: string, checkFunc: (value: unknown) => bool) {
    this.innerName = name;
    this.check = checkFunc;
  }

  get name(): string {
    return this.innerName;
  }

  /**
   * Validator that ensures that a value belongs to this type.
   *
   * @param value  Variable to check.
   */
  public check(value: unknown): bool;
}

export default ValueType;
