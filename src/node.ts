import { VEvent, VEventTarget } from './vanillaEvent';
import InputSocket from './inputSocket';
import OutputSocket from './outputSocket';
import SocketCollection from './socketCollection';
import Engine from './engine';

/**
 * Class that does processing, using InputSocket and OutputSocket.
 */
class Node extends VEventTarget {
  /**
   * Reference to the engine where this node belongs to.
   */
  public engine: Engine | null;

  /**
   * Identifier used to differentiate from other instances of this class.
   */
  name: string;

  /**
   * @param name  See {@link name}
   */
  constructor(name: string, engine?: Engine) {
    super();
    this.name = name || 'Untitled';
    this.engine = engine || null;
    this.dispatchEvent(new VEvent('nodeCreated')); // Use with caution when using controller
  }

  /**
   * A collection of InputSocket objects.
   */
  inputs = new SocketCollection<InputSocket>();

  /**
   * The size of stored inputs.
   */
  inputCount = 0;

  /**
   * The count of inputs that have been resolved.
   */
  resolvedInputs = 0;

  /**
   * The state of the node.
   */
  state: { [key: string]: unknown; } | null = {};

  /**
   * A boolean used to determine if the state gets reset before the next cycle
   */
  private resetState = true;

  /**
   * A collection of OutputSocket objects.
   */
  outputs = new SocketCollection<OutputSocket>();

  /**
   * Register a new input.
   *
   * @param name  Name of the inputSocket to generate
   * @param inputType  Name of the ValueType which is defined in this node's engine
   * @return  Newly created inputSocket object.
   */
  addInput(name: string, valueType?: string): InputSocket {
    if (name in this.inputs) throw Error('Input name already exists');

    let socket;
    if (valueType) {
      if (!this.engine) throw Error('Engine is needed to specify a valueType!');
      socket = new InputSocket(this.engine.getValueTypeDefinition(valueType));
    } else {
      socket = new InputSocket();
    }

    socket.name = name;
    this.inputs.addSocket(socket);
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
    return this.inputs.getSocketByName(name);
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
   *
   */
  dumpInputs(): void {
    this.log('*** Input dump ***');
    this.inputs.getAllSockets().forEach((input) => {
      this.log(
        `Input ${input.name}:`,
        input.isNothing() ? 'nothing' : input.getValue(),
      );
    });
    this.dispatchEvent(new VEvent('dumpInputs'));
  }

  /**
   * Register a new output
   *
   * @param name  Name of the OutputSocket object to generate
   * @return  Newly created OutputSocket object.
   */
  addOutput(name: string, valueType?: string, storageMode?: boolean): OutputSocket {
    let socket;
    if (valueType) {
      if (!this.engine) throw Error('Engine is needed to specify a valueType!');
      socket = new OutputSocket(
        this,
        this.engine.getValueTypeDefinition(valueType),
        storageMode,
      );
    } else {
      socket = new OutputSocket(this,undefined, storageMode);
    }

    socket.name = name;
    this.outputs.addSocket(socket);

    this.dispatchEvent(new VEvent('addOutput', { detail: { outputName: name } }));
    return socket;
  }

  /**
   * Receive an output by its name
   *
   * @param name  Name of the OutputSocket object to be found.
   */
  getOutput(name: string): OutputSocket {
    return this.outputs.getSocketByName(name);
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
    this.log('*** Output dump ***');
    this.outputs.getAllSockets().forEach((output) => {
      this.log(
        `Output ${output.name}:`,
        output.isNothing() ? 'nothing' : output.getValue(),
      );
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
  private resolved = false;

  /**
   * Prepare node for resolving.
   */
  preResolve(): void {
    this.busy = false;
    this.resolved = false;
    this.inputs.getAllSockets().forEach((input) => input.reset());
    this.outputs.getAllSockets().forEach((output) => output.reset());
  }

  /**
   * Check all input availability.
   */
  resolve(): Promise<void> | void {
    if (this.busy) return;
    this.dispatchEvent(new VEvent('beforeResolve'));
    this.busy = true;
    this.resolvedInputs = 0;
    this.inputs.getAllSockets().forEach((input) => {
      if (!input.isValid()) throw Error('Input is not linked and has no default.');
      if (input.isSet()) {
        this.resolvedInputs++;
      } else {
        input.pull();
      }
    });
    if (!this.resolved && this.resolvedInputs === this.inputCount) {
      // eslint-disable-next-line consistent-return
      return this.inputsReady();
    }
  }

  inputsReady(): void | Promise<void> {
    return new Promise<void>((pResolve) => {
      this.log('Node action:', this.name);
      this.dumpInputs();
      if (this.resetState === true) this.state = {};
      this.resetState = true;
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
            () => {
              if (this.resetState === true) this.state = null;
              this.actionReady();
              pResolve();
            },
            (err) => { this.actionError(err); },
          );
      } else {
        if (this.resetState === true) this.state = null;
        this.actionReady();
        pResolve();
      }
    });
  }

  actionReady(): void {
    // Set all unset outputs
    this.outputs.getAllSockets().forEach((output) => {
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

  actionError(err: Error): void {
    this.dispatchEvent(new VEvent('error', { detail: { error: err } }));
  }

  /**
   * Method, that dispatches log event with given args.
   *
   * @param args All the passed arguments to the method as an array.
   * Event's detail contains the array as a property.
   *
   */
  log(...args: unknown[]): void {
    this.dispatchEvent(new VEvent('log', { detail: { args } }));
  }

  /**
   * The action code must call this method, if the node has to maintain state until the next cycle.
   */
  keepState(): void {
    this.resetState = false;
  }

  /**
   * Checks if the node has state.
   * @returns True if node has state, false if doesn't.
   */
  hasState(): boolean {
    if (!this.resolved) throw new Error('Node is not resolved');
    return this.state !== null;
  }

  /**
   * Denotes whether the network has finished resolving.
   * @returns True if the network is resolved, false if not.
   */
  isResolved(): boolean {
    return this.resolved;
  }
}

export default Node;
