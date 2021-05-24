import type { SocketValueType } from './socket/value';
import type NodeType from './nodeType';

class Engine {
  private socketValueTypeDefinitions: Record<string, SocketValueType<unknown>> = {};

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

  public getSocketValueTypeDefinition(name: string): SocketValueType<unknown> {
    if (name in this.socketValueTypeDefinitions) return this.socketValueTypeDefinitions[name];
    throw Error(`Type ${name} does not exist!`);
  }

  /**
   * Register a new node type to this engine.
   *
   * @param nodeType The NodeType to add
   */
  public addNodeTypeDefinition(nodeType: NodeType): void {
    for (const n of this.nodeTypeDefinitions) {
      if (n.name === nodeType.name) {
        throw Error(`NodeType ${n.name} already exists!`);
      }
    }
    this.nodeTypeDefinitions.push(nodeType);
  }

  public addSocketValueTypeDefinition(
    name: string, socketValueType: SocketValueType<unknown>,
  ): void {
    if (name in this.socketValueTypeDefinitions) {
      throw Error(`SocketValueType ${name} already exists!`);
    }
    this.socketValueTypeDefinitions[name] = socketValueType;
  }
}

export default Engine;
