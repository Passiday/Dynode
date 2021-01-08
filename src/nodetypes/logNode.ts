import Node from './../node'

// Console.log-Node.
// Outputs its input to the console

class LogNode extends Node {
  constructor() {
    super(1, 1, "log_node");
    super.setLogging(true);
  }

  update() {
    this.outputs[0] = this.inputs[0];
    super.update();
  }
}

export default LogNode