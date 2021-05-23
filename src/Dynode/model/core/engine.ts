import type { ValueConstructor } from './socket/value';
import type NodeType from './nodeType';

class Engine {
  private valueDefinitions: Record<string, ValueConstructor<unknown>> = {};

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

  public addValueDefinition(name: string, valueConstructor: ValueConstructor<unknown>): void {
    if (name in this.valueDefinitions) throw Error(`ValueConstructor ${name} already exists!`);
    this.valueDefinitions[name] = valueConstructor;
  }
}

export default Engine;
