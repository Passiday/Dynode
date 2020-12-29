import Node from './../node'

// Console.log Node or ClogNode for short
class ConstNode extends Node {
  value: any;
  constructor(value: any) {
    super(0, 1, "const_node");
    this.value = value;
  }

  update() {
    this.outputs[0] = this.value;
    super.update();
  }
}

export default ConstNode