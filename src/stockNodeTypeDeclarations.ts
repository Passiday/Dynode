import Node from './node';
import type Engine from './engine';

interface NodeCreatorFunc {
  (name: string, engine?: Engine): Node;
}

class Nodetype {
  private innerName;

  /**
   * @param name See {@link name}
   * @param createFunc See {@link createFunc}
   */
  constructor(name: string, createFunc: NodeCreatorFunc) {
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
  readonly createFunc: NodeCreatorFunc;
}

function createMathNode(name: string, engine?: Engine): Node {
  const node = new Node(name, engine);
  node.addInput('operator', 'string');
  node.addInput('lhs', 'number');
  node.addInput('rhs', 'number');
  node.addOutput('result');
  node.action = function (this: Node) {
    if (this.inputIsNothing('lhs')) return;
    if (this.inputIsNothing('rhs')) return;

    const operator = this.getInputValue('operator');
    const lhs = this.getInputValue('lhs');
    const rhs = this.getInputValue('rhs');

    let val: number;
    switch (operator) {
      case '+':
        val = lhs + rhs;
        break;
      case '-':
        val = lhs - rhs;
        break;
      case '*':
        val = lhs * rhs;
        break;
      case '/':
        if (rhs === 0) throw Error('Zero division error with rhs!');
        val = lhs / rhs;
        break;
      default:
        throw Error(`Invalid operator ${operator}`);
    }

    this.setOutputValue('result', val);
  };
  return node;
}

function createConstNode(name: string, engine?: Engine): Node {
  const node = new Node(name, engine);
  node.addInput('input');
  node.addOutput('result');
  node.action = function (this: Node) {
    this.setOutputValue('result', this.getInputValue('input'));
  };
  return node;
}

export default [
  new NodeType('math', createMathNode),
  new NodeType('const', createConstNode),
];
