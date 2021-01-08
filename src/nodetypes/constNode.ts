import Node from './../node'

// Constant-value-Node
// Outputs constant value

class ConstNode extends Node {
  value: any;
  constructor(value: any) {
    super(0, 1, "const_node");
    this.value = value;
  }

  update() {
    this.outputs[0].setValue(this.value);
    super.update();
  }

  // Needs a function to change the default value for this node
  // ...
}

export default ConstNode