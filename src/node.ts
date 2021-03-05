import { VEvent, VEventTarget } from './vanillaEvent';
import InputSocket from './inputSocket';
import OutputSocket from './outputSocket';

/**
 * Class that does processing, using InputSocket and OutputSocket.
 */
class Node extends VEventTarget {
  /**
   * Identifier used to differentiate from other instances of this class.
   */
  name: string;

  /**
   * @param name  See {@link name}
   */
  constructor(name: string) {
    super();
    this.name = name || 'Untitled';
    this.dispatchEvent(new VEvent('nodeCreated')); // Use with caution when using controller
  }

  /**
   * A collection of InputSocket objects.
   */
  inputs: {
    [key: string]: InputSocket,
  } = {};

  /**
   * The size of stored inputs.
   */
  inputCount = 0;

  /**
   * The count of inputs that have been resolved.
   */
  resolvedInputs = 0;

  /**
   * Register a new input.
   *
   * @param name  Name of the inputSocket to generate
   * @return  Newly created inputSocket object.
   */
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

  /**
   * Find an input by name.
   *
   * @param name  The name of the input to be found.
   */
  getInput(name: string): InputSocket {
    if (name in this.inputs) return this.inputs[name];
    throw Error(`Input "${name}" not found`);
  }

  // removeInput(name: string): void {
  //   //TODO
  // }

  /**
   * Obtain the value of an input.
   *
   * @param name  The name of the input of which the value will be retrieved.
   */
  getInputValue(name: string): unknown {
    const input = this.getInput(name);
    return input.getValue();
  }

  /**
   * Denotes whether the given input is equal to nothing.
   *
   * @param name  The name of the input to be checked.
   */
  inputIsNothing(name: string): boolean {
    const input = this.getInput(name);
    return input.isNothing();
  }

  /**
   * Connect an input with an output.
   *
   * @param name  The name of the input to link from.
   * @param outputSocket  OutputSocket to link to.
   */
  linkInput(name: string, outputSocket: OutputSocket): void {
    const input = this.getInput(name);
    input.linkSocket(outputSocket);
    this.dispatchEvent(new VEvent('linkInput', { detail: { inputName: name } }));
  }

  /**
   * Remove links from an input.
   *
   * @param name  The name of the input to remove links from.
   */
  unlinkInput(name: string): void {
    const input = this.getInput(name);
    input.clearLink();
    this.dispatchEvent(new VEvent('unlinkInput', { detail: { inputName: name } }));
  }

  /**
   * Print the object's inputs to console.
   */
  dumpInputs(): void {
    console.log('*** Input dump ***');
    Object.keys(this.inputs).forEach((inputName) => {
      const input = this.getInput(inputName);
      console.log(`Input ${inputName}:`, input.isNothing() ? 'nothing' : input.getValue());
    });
    this.dispatchEvent(new VEvent('dumpInputs'));
  }

  /**
   * A collection of OutputSocket objects.
   */
  outputs: {
    [key: string]: OutputSocket,
  } = {};

  /**
   * Register a new output
   *
   * @param name  Name of the OutputSocket object to generate
   * @return  Newly created OutputSocket object.
   */
  addOutput(name: string): OutputSocket {
    if (name in this.outputs) throw Error('Output name already exists');
    const socket = new OutputSocket(this);
    this.outputs[name] = socket;
    this.dispatchEvent(new VEvent('addOutput', { detail: { outputName: name } }));
    return socket;
  }

  /**
   * Receive an output by its name
   *
   * @param name  Name of the OutputSocket object to be found.
   */
  getOutput(name: string): OutputSocket {
    if (name in this.outputs) return this.outputs[name];
    throw Error('Output not found');
  }

  // removeOutput(name: string): void {
  //   //TODO
  // }

  /**
   * Find an output by name and set its value.
   *
   * @param name  Name of the OutputSocket object to be found.
   * @param value  New value to be set.
   */
  setOutputValue(name: string, value: unknown): void {
    const output = this.getOutput(name);
    if (arguments.length > 1) {
      output.setValue(value);
    } else {
      output.setValue();
    }
    // this.dispatchEvent(new VEvent('setOutputValue')); TODO event bubbling
  }

  /**
   * Print the object's outputs to console.
   */
  dumpOutputs(): void {
    console.log('*** Output dump ***');
    Object.keys(this.outputs).forEach((outputName) => {
      const output = this.getOutput(outputName);
      console.log(`Output ${outputName}:`, output.isNothing() ? 'nothing' : output.getValue());
    });
    this.dispatchEvent(new VEvent('dumpOutputs'));
  }

  /**
   * Denotes whether the object is not available.
   */
  busy = false;

  /**
   * Denotes whether the object has finished and set the outputs.
   */
  resolved = false;

  /**
   * Prepare node for resolving.
   */
  preResolve(): void {
    this.busy = false;
    this.resolved = false;
  }

  /**
   * Check all input availability.
   */
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
  }

  inputsReady(): void {
    console.log('Node action:', this.name);
    this.dumpInputs();
    let p;
    try {
      p = this.action();
    } catch (err) {
      this.actionError(err);
      return;
    }
    if (p instanceof Promise) {
      p
        .then(
          () => { this.actionReady(); },
          (err) => { this.actionError(err); },
        );
    } else {
      this.actionReady();
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
    this.dispatchEvent(new VEvent('afterResolve'));
  }

  /**
   * Function that processes the input and prepares output.
   */
  action = (): void | Promise<void> => {
    // Do something with inputs, set some outputs
  };

  actionError = (err: Error): void => {
    this.dispatchEvent(new VEvent('error', { detail: { error: err } }));
  };
}

export default Node;
