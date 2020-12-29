import Node from './../node'

// Elementary-Arithmetic-Node or ElarithNode for short
class ElarithNode extends Node {
  operation: string;
  def0: number;
  def1: number;
  constructor(operation: string, def0: any = null, def1: any = null) {
    super(2, 1, "elarith_node");
    this.operation = operation;
    this.def0 = def0;
    this.def1 = def1;
  }

  update() {
    this.outputs[0] = null;
    if(this.inputs[0] == null) {this.inputs[0] = this.def0;}
    if(this.inputs[1] == null) {this.inputs[1] = this.def1;}
    if(this.inputs[0] != null && this.inputs[1] != null) {
      switch(this.operation) {
        case '+':
          this.outputs[0] = this.inputs[0] + this.inputs[1];
          break;
        case '-':
          this.outputs[0] = this.inputs[0] - this.inputs[1];
          break;
        case '*':
          this.outputs[0] = this.inputs[0] * this.inputs[1];
          break;
        case '/':
          // Check for division with 0 here
          this.outputs[0] = this.inputs[0] / this.inputs[1];
          break;
      }
    }
    super.update();
  }
}

export default ElarithNode