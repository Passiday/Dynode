import Node from './../node'

// Default-value-Node or DefNode for short
class DefNode extends Node {
  value: any;
  constructor(value: any) {
    super(1, 1, "def_node");
    this.value = value;
  }

  update() {
    if(this.inputs[0] != null) {
        this.outputs[0] = this.inputs[0];
    } else {
        this.outputs[0] = this.value;
    }
    super.update();
  }
}

export default DefNode