import Node from './node';

class NodeType {
  private innerName;

  /**
   * @param name See {@link name}
   * @param createFunc See {@link createFunc}
   */
  constructor(name: string, createFunc: (node: Node) => Node) {
    this.innerName = name;
    this.createFunc = createFunc;
  }

  /**
   * String representation of the node type.
   */
  get name(): string {
    return this.innerName;
  }

  /**
   * Function for creating a Node that matches this type.
   */
  readonly createFunc: (node: Node) => Node;
}

export default NodeType;
