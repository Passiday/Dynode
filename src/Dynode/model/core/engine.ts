import type ValueType from './socket/valueType';
import type NodeType from './nodeType';

class Engine {
  private valueTypeDefinitions: ValueType[] = [];

  /**
   * List of node types registered in this engine.
   */
  private nodeTypeDefinitions: NodeType[] = [];

  /**
   * Given name, find corresponding NodeType
   *
   * @param name The name of the NodeType
   * @return The corresponding NodeType object
   */
  public getNodeTypeDefinition(name: string): NodeType {
    for (const n of this.nodeTypeDefinitions) {
      if (n.name === name) return n;
    }
    throw Error(`Type ${name} does not exist!`);
  }

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
   * Register a new node type to this engine.
   *
   * @param nodeType The NodeType to add
   */
  public addNodeTypeDefinition(nodeType: NodeType): void {
    for (const n of this.nodeTypeDefinitions) {
      if (n.name === nodeType.name) throw Error(`NodeType ${n.name} already exists!`);
    }
    this.nodeTypeDefinitions.push(nodeType);
  }

  /**
   * Register a new value type to this engine.
   *
   * @param valueType The ValueType to add
   */
  public addValueTypeDefinition(valueType: ValueType): void {
    for (const v of this.valueTypeDefinitions) {
      if (v.name === valueType.name) {
        throw Error(`ValueType ${v.name} already exists!`);
      }
    }
    this.valueTypeDefinitions.push(valueType);
  }
}

export default Engine;
