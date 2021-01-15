import Socket from './socket';

class Node {
  inputs: Socket[];

  outputs: Socket[];

  logging: boolean; // Whether node should log its outputs to console after updating

  name: string; // Name is (currently) used for discerning node outputs in console

  constructor(inputN: number, outputN: number, name = 'node') {
    // Initialize input sockets
    this.inputs = new Array<Socket>();
    for (let i = 0; i < inputN; i++) { this.inputs.push(new Socket()); }

    // Initialize output sockets
    this.outputs = new Array<Socket>();
    for (let i = 0; i < outputN; i++) { this.outputs.push(new Socket()); }

    this.logging = false;
    this.name = name;
  }

  setName(name: string): void {
    this.name = name;
  }

  setLogging(logging: boolean): void {
    this.logging = logging;
  }

  setInput(value: any, inputN: number): void {
    this.inputs[inputN].setValue(value);
  }

  getOutput(outputN: number): Socket {
    return this.outputs[outputN].getValue();
  }

  update(): void {
    if (this.logging) {
      console.log(`${this.name}: ${this.outputs.map((output) => output.getValue())}`);
    }
  }
}

export default Node;
