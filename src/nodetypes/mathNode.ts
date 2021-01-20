import Node from '../node';

// Elementary-Arithmetic-Node
// Capable of performing addition, substraction, multiplication and division

class MathNode extends Node {
  operation: string; // Valid operations are: ["+", "-", "*", "/"]
  
  def0: number|null;
  
  def1: number|null;
  
  constructor(operation: string, def0: number|null = null, def1: number|null = null) {
    super(2, 1, 'math_node');
    this.operation = operation;
    this.def0 = def0;
    this.def1 = def1;
  }

  update(): void {
    this.outputs[0].setValue(null); // Set default output to null
    const value0 = (this.inputs[0].getValue() === null ? this.def0 : this.inputs[0].getValue());
    const value1 = (this.inputs[1].getValue() === null ? this.def1 : this.inputs[1].getValue());
    if (value0 !== null && value1 !== null) {
      switch (this.operation) {
        case '+': // Addition
          this.outputs[0].setValue(value0 + value1);
          break;
        case '-': // Substraction
          this.outputs[0].setValue(value0 - value1);
          break;
        case '*': // Multiplication
          this.outputs[0].setValue(value0 * value1);
          break;
        case '/': // Division
          if (value1 === 0) break; // Output default null value when dividing by 0
          this.outputs[0].setValue(value0 / value1);
          break;
        default:
          this.outputs[0].setValue(null);
      }
    }
    super.update();
  }
}

export default MathNode;
