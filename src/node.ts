class Node {
  inputs: any[];
  outputs: any[];
  logging: boolean; // Whether node should log its outputs to console after updating
  name: string; // Name is (currently) used for discerning node outputs in console
  constructor(inputN: number, outputN: number, name: string = "node") {
    this.inputs = new Array<any>(inputN);
    this.outputs = new Array<any>(outputN);
    this.logging = false;
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }

  setLogging(logging: boolean) {
    this.logging = logging;
  }

  setInput(value: any, inputN: number) {
    this.inputs[inputN] = value;
  }

  getOutput(outputN: number) {
    return this.outputs[outputN];
  }

  update() {
    if(this.logging) {
      console.log(`${this.name}: ${this.outputs}`);
    }
  }
}

export default Node