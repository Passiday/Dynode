import type { ValueConstructor } from './socket/value';
import type ValueType from './socket/valueType';
import type NodeType from './nodeType';

class Engine {
  private valueDefinitions: Record<string, ValueConstructor<unknown>> = {};

  private valueTypeDefinitions: Record<string, ValueType> = {};

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

  public getValueDefinition(name: string): ValueConstructor<unknown> {
    if (name in this.valueDefinitions) return this.valueDefinitions[name];
    throw Error(`Type ${name} does not exist!`);
  }

  /**
   * Given valueType, find corresponding ValueType.
   *
   * @param valueType The name of the ValueType object
   * @return The corresponding ValueType object
   */
  public getValueTypeDefinition(valueType: string): ValueType {
    if (valueType in this.valueTypeDefinitions) return this.valueTypeDefinitions[valueType];
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

  public addValueDefinition(name: string, valueConstructor: ValueConstructor<unknown>){
    if (name in this.valueDefinitions) throw Error(`ValueConstructor ${name} already exists!`);
    this.valueDefinitions[name] = valueConstructor
  }

  /**
   * Register a new value type to this engine.
   *
   * @param valueType The ValueType to add
   */
  public addValueTypeDefinition(name: string, valueType: ValueType): void {
    if (name in this.valueTypeDefinitions) throw Error(`ValueType ${name} already exists!`);
    this.valueTypeDefinitions[name] = valueType;
  }
}

export default Engine;
