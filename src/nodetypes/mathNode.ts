import Node from '../node';

// Elementary-Arithmetic-Node
// Capable of performing addition, substraction, multiplication and division

class MathNode extends Node {
  operation: string; // Valid operations are: ["+", "-", "*", "/"]

  def0: number;

  def1: number;

  constructor(operation: string, def0: any = null, def1: any = null) {
    super(2, 1, 'math_node');
    this.operation = operation;
    this.def0 = def0;
    this.def1 = def1;
  }

  update() {
    this.outputs[0].setValue(null); // Set default output to null
    if (this.inputs[0].getValue() == null) { this.inputs[0].setValue(this.def0); }
    if (this.inputs[1].getValue() == null) { this.inputs[1].setValue(this.def1); }
    if (this.inputs[0].getValue() != null && this.inputs[1].getValue() != null) {
      switch (this.operation) {
        case '+': // Addition
          this.outputs[0].setValue(this.inputs[0].getValue() + this.inputs[1].getValue());
          break;
        case '-': // Substraction
          this.outputs[0].setValue(this.inputs[0].getValue() - this.inputs[1].getValue());
          break;
        case '*': // Multiplication
          this.outputs[0].setValue(this.inputs[0].getValue() * this.inputs[1].getValue());
          break;
        case '/': // Division
          if (this.inputs[1].getValue() == 0) // Output default null value when dividing by 0
          { break; }
          this.outputs[0].setValue(this.inputs[0].getValue() / this.inputs[1].getValue());
          break;
      }
    }
    super.update();
  }
}

export default MathNode;
