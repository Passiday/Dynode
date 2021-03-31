import Node from './node';
import NodeType from './nodeType';

function createMathNode(node: Node): Node {
  const n = node;
  n.addInput('operator', 'string');
  n.addInput('lhs', 'number');
  n.addInput('rhs', 'number');
  n.addOutput('result');
  n.action = function (this: Node) {
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
  return n;
}

function createConstNode(node: Node): Node {
  const n = node;
  n.addInput('input');
  n.addOutput('result');
  n.action = function (this: Node) {
    this.setOutputValue('result', this.getInputValue('input'));
  };
  return n;
}

export default [
  new NodeType('math', createMathNode),
  new NodeType('const', createConstNode),
];
