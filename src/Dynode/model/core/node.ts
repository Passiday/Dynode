import { VEvent, VEventTarget } from 'src/utils/vanillaEvent';
import {
  InputSocket, OutputSocket, SocketCollection, Value, ValueConstructor,
} from './socket';
import Engine from './engine';
import type Network from './network';
import type NodeType from './nodeType';

/**
 * Class that does processing, using InputSocket and OutputSocket.
 */
class Node extends VEventTarget {
  /**
   * Reference to the network this node belongs to.
   */
  private network: Network | null;

  /**
   * Reference to the engine where this node belongs to.
   */
  public engine: Engine | null;

  /**
   * The type of this node.
   */
  public nodeType: NodeType | null;

  /**
   * Identifier used to differentiate from other instances of this class.
   */
  name: string;

  /**
   * @param name  See {@link name}
   */
  constructor(name: string, network?: Network, nodeType?: NodeType) {
    super();
    this.name = name || 'Untitled';
    this.network = network || null;
    this.engine = network ? network.engine : null;
    this.nodeType = nodeType || null;
    if (nodeType) nodeType.createFunc(this);
    this.dispatchEvent(new VEvent('nodeCreated')); // Use with caution when using controller
  }

  /**
   * A collection of InputSocket objects.
   */
  inputs = new SocketCollection<InputSocket<unknown>>();

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
  state: { [key: string]: unknown; } = {};

  /**
   * A collection of OutputSocket objects.
   */
  outputs = new SocketCollection<OutputSocket<unknown>>();

  /**
   * A helper for retrieving an optional ValueConstructor.
   *
   * The main purpose is to provide an argument for socket which can take undefined and
   * assume the default or a name can be passed which then is extracted from engine. This
   * done so it is possible to add default type sockets without an engine.
   *
   * @param name ValueConstructor name that is stored in engine
   */
  private getValueType(name?: string): ValueConstructor<unknown> | undefined {
    if (name === undefined) {
      return undefined;
    }
    if (!this.engine) throw Error('Engine is not defined!');
    return this.engine.getValueDefinition(name);
  }

  /**
   * Register a new input.
   *
   * @param name  Name of the inputSocket to generate
   * @param inputType  Name of the ValueType which is defined in this node's engine
   * @return  Newly created inputSocket object.
   */
  addInput(name: string, value?: unknown, valueType?: string): InputSocket<unknown> {
    if (name in this.inputs) throw Error('Input name already exists');
    const socket = new InputSocket(value, this.getValueType(valueType));

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
  getInput(name: string): InputSocket<unknown> {
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
  getInputValue(name: string): Value<unknown> {
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
  linkInput(name: string, outputSocket: OutputSocket<unknown>): void {
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
  addOutput(
    name: string, value?: unknown, valueType?: string, storageMode?: boolean,
  ): OutputSocket<unknown> {
    if (name in this.outputs) throw Error('Input name already exists');
    const socket = new OutputSocket(this, value, this.getValueType(valueType), storageMode);

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
  getOutput(name: string): OutputSocket<unknown> {
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
      output.setNothing();
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
   * Initialize the node for clean run.
   */
  public reset(): void {
    this.clear();
    this.state = {};
    this.inputs.reset();
    this.outputs.reset();
  }

  /**
   * Prepare node for resolving.
   */
  public clear(): void {
    this.busy = false;
    this.resolved = false;
    this.inputs.clear();
    this.outputs.clear();
  }

  /**
   * Check all input availability.
   */
  resolve(): Promise<void> | void {
    // TODO: just returning when the node is busy or resolved can lead to hard-to-debug situations
    // basically, that is an error situtation that deserves to be treated as such.
    if (this.busy || this.resolved) return;
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
      this.dispatchEvent(new VEvent('inputsReady'));
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
              this.actionReady();
              pResolve();
            },
            (err) => { this.actionError(err); },
          );
      } else {
        this.actionReady();
        pResolve();
      }
    });
  }

  actionReady(): void {
    // Set all unset outputs
    this.outputs.getAllSockets().forEach((output) => {
      if (!output.isSet()) output.setNothing();
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

  /**
   * Send halt signal to {@link network}
   */
  public halt(): void {
    if (this.network) this.network.halt();
  }
}

export default Node;
