import Node from './../node'

// Console.log-Node or ClogNode for short
class ClogNode extends Node {
  constructor() {
    super(1, 1, "clog_node");
    super.setLogging(true);
  }

  update() {
    this.outputs[0] = this.inputs[0];
    super.update();
  }
}

export default ClogNode