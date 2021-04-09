import type ValueType from './valueType';
import type NodeType from './nodeType';

class Engine {
  private valueTypeDefinitions: ValueType[] = [];

  /**
   * List of node types registered in this engine.
   */
  private nodeTypeDefinitions: NodeType[] = [];

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

  /**
   * Register a new value type to this engine.
   */
  public addNodeTypeDefinition(nodeType: NodeType): void {
    this.nodeTypeDefinitions.push(nodeType);
  }

  /**
   * Register a new value type to this engine.
   */
  public addValueTypeDefinition(valueType: ValueType): void {
    this.valueTypeDefinitions.push(valueType);
  }
}

export default Engine;
