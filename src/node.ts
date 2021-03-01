import { VEvent, VEventTarget } from './vanillaEvent';
import InputSocket from './inputSocket';
import OutputSocket from './outputSocket';

class Node extends VEventTarget {
  name: string;

  constructor(name: string) {
    super();
    this.name = name || 'Untitled';
    this.dispatchEvent(new VEvent('nodeCreated')); // Use with caution when using controller
  }

  // Input business
  inputs: {
    [key: string]: InputSocket,
  } = {};

  inputCount = 0;

  resolvedInputs = 0;

  addInput(name: string): InputSocket {
    if (name in this.inputs) throw Error('Input name already exists');
    const socket = new InputSocket();
    this.inputs[name] = socket;
    socket.addEventListener('value', (e) => {
      this.resolvedInputs++;
      if (this.resolvedInputs === this.inputCount) {
        this.inputsReady();
      }
    });
    this.inputCount++;
    this.dispatchEvent(new VEvent('addInput', { detail: { inputName: name } }));
    return socket;
  }

  getInput(name: string): InputSocket {
    if (name in this.inputs) return this.inputs[name];
    throw Error(`Input "${name}" not found`);
  }

  // removeInput(name: string): void {
  //   //TODO
  // }

  getInputValue(name: string): unknown {
    const input = this.getInput(name);
    return input.getValue();
  }

  inputIsNothing(name: string): boolean {
    const input = this.getInput(name);
    return input.isNothing();
  }

  linkInput(name: string, outputSocket: OutputSocket): void {
    const input = this.getInput(name);
    input.linkSocket(outputSocket);
    this.dispatchEvent(new VEvent('linkInput', { detail: { inputName: name } }));
  }

  unlinkInput(name: string): void {
    const input = this.getInput(name);
    input.clearLink();
    this.dispatchEvent(new VEvent('unlinkInput', { detail: { inputName: name } }));
  }

  dumpInputs(): void {
    console.log('*** Input dump ***');
    Object.keys(this.inputs).forEach((inputName) => {
      const input = this.getInput(inputName);
      console.log(`Input ${inputName}:`, input.isNothing() ? 'nothing' : input.getValue());
    });
    this.dispatchEvent(new VEvent('dumpInputs'));
  }

  // Output business
  outputs: {
    [key: string]: OutputSocket,
  } = {};

  addOutput(name: string): OutputSocket {
    if (name in this.outputs) throw Error('Output name already exists');
    const socket = new OutputSocket(this);
    this.outputs[name] = socket;
    this.dispatchEvent(new VEvent('addOutput', { detail: { outputName: name } }));
    return socket;
  }

  getOutput(name: string): OutputSocket {
    if (name in this.outputs) return this.outputs[name];
    throw Error('Output not found');
  }

  // removeOutput(name: string): void {
  //   //TODO
  // }

  setOutputValue(name: string, value: unknown): void {
    const output = this.getOutput(name);
    if (arguments.length > 1) {
      output.setValue(value);
    } else {
      output.setValue();
    }
    // this.dispatchEvent(new VEvent('setOutputValue')); TODO event bubbling
  }

  dumpOutputs(): void {
    console.log('*** Output dump ***');
    Object.keys(this.outputs).forEach((outputName) => {
      const output = this.getOutput(outputName);
      console.log(`Output ${outputName}:`, output.isNothing() ? 'nothing' : output.getValue());
    });
    this.dispatchEvent(new VEvent('dumpOutputs'));
  }

  // All other business
  busy = false;

  resolved = false;

  preResolve(): void {
    this.busy = false;
    this.resolved = false;
  }

  resolve(): void {
    if (this.busy) return;
    this.dispatchEvent(new VEvent('beforeResolve'));
    this.busy = true;
    this.resolvedInputs = 0;
    Object.keys(this.inputs).forEach((inputName) => {
      const input = this.getInput(inputName);
      if (!input.isValid()) throw Error('Input is not linked and has no default.');
      if (input.isSet()) {
        this.resolvedInputs++;
      } else {
        input.pull();
      }
    });
    if (!this.resolved && this.resolvedInputs === this.inputCount) {
      this.inputsReady();
    }
    this.dispatchEvent(new VEvent('afterResolve'));
  }

  inputsReady(): void {
    console.log('Node action:', this.name);
    this.dumpInputs();
    const p = this.action();
    if (p instanceof Promise) {
      p
        .then(
          () => {
            this.actionReady();
          },
        )
        .catch(
          (err) => { this.actionError(err); },
        );
    } else {
      try {
        this.actionReady();
      } catch (err) {
        this.actionError(err);
      }
    }
  }

  actionReady(): void {
    // Set all unset outputs
    Object.keys(this.outputs).forEach((outputName) => {
      const output = this.getOutput(outputName);
      if (!output.isSet()) output.setValue();
    });
    this.dumpOutputs();
    this.busy = false;
    this.resolved = true;
    this.dispatchEvent(new VEvent('ready'));
  }

  action = (): void | Promise<void> => {
    // Do something with inputs, set some outputs
  };

  actionError = (err: Error): void => {
    throw err;
  };
}

export default Node;
