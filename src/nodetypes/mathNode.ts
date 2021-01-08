import Node from './../node'

// Elementary-Arithmetic-Node
// Capable of performing addition, substraction, multiplication and division

class MathNode extends Node {
  operation: string; // Valid operations are: ["+", "-", "*", "/"]
  def0: number;
  def1: number;
  constructor(operation: string, def0: any = null, def1: any = null) {
    super(2, 1, "math_node");
    this.operation = operation;
    this.def0 = def0;
    this.def1 = def1;
  }

  update() {
    this.outputs[0] = null; // Set default output to null
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
          if(this.inputs[1] == 0)
            break;
          this.outputs[0] = this.inputs[0] / this.inputs[1];
          break;
      }
    }
    super.update();
  }
}

export default MathNode