import Node from '../node';

// Constant-value-Node
// Outputs constant value

class ConstNode extends Node {
  value: number|null;

  constructor(value: number|null) {
    super(0, 1, 'const_node');
    this.value = value;
  }

  update(): void {
    this.outputs[0].setValue(this.value);
    super.update();
  }

  // Needs a function to change the default value for this node
  // ...
}

export default ConstNode;
