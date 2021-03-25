import StockValueTypeDeclarations from './stockValueTypeDeclarations';
import ValueType from './valueType';

class Engine {
  private valueTypeDefinitions: ValueType[] = StockValueTypeDeclarations;

  /**
   * Given valueType, find corresponding ValueType.
   *
   * @param valueType The name of the ValueType object
   * @return The corresponding ValueType object
   */
  public getValueTypeDefinition(valueType: string): ValueType {
    for (const v of this.valueTypeDefinitions) {
      if (v.name === valueType) return v;
    }
    throw Error(`Type ${valueType} does not exist!`);
  }
}

export default Engine;
