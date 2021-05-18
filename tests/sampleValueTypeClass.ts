/* eslint class-methods-use-this: off */
import { ValueType } from 'src/Dynode/model/core/socket';
import { JsonValue } from 'src/utils/objectUtils';

export default class ExampleValueType extends ValueType {
  public check(value: unknown): boolean {
    return (typeof value === 'number' && value % 2 === 0);
  }

  public toJSON(value: unknown): JsonValue {
    return value as number;
  }
}
