import Network from './network';
import Node from './node';
import { StageUI, NodeUI } from './DynodeUI';
import { VEvent } from './vanillaEvent';
import { JsonObject, JsonValue } from './objectUtils';
import InputSocket from './inputSocket';

class NodeController {
  model: Node;

  view: NodeUI;

  constructor(model: Node, view: NodeUI) {
    this.model = model;
    this.view = view;
    this.addHandlers();
  }

  addHandlers(): void { // Init model event handlers
    const { view: nodeUI } = this;
    function afterResolve(this: Node): void {
      let s = '';
      this.outputs.getAllSockets().forEach((output) => {
        s += `Output ${output.name}: ${output.isNothing() ? 'nothing' : output.getValue()}, `;
      });
      nodeUI.setInfo(s);
    }
    function inputsReady(this: Node): void {
      const inputConfig: JsonObject = {};
      this.inputs.getAllSockets().forEach((input) => {
        if (!input.isNothing() && input.name !== null) {
          inputConfig[input.name] = {
            value: input.getJsonValue(),
          };
        }
      });
      nodeUI.updateInputs(inputConfig);
    }
    function nodeRemoved(this: Node): void {
      nodeUI.remove();
    }
    this.model.addEventListener('afterResolve', afterResolve);
    this.model.addEventListener('nodeRemoved', nodeRemoved); // Perhaps this event belongs to the Network model?
    this.model.addEventListener('inputsReady', inputsReady);
  }
}

class NetworkController {
  model: Network;

  view: StageUI;

  constructor(model: Network, view: StageUI) {
    this.model = model;
    this.view = view;

    this.addHandlers();
    // TODO implement controller initialization for already populated network
  }

  addHandlers(): void { // Function that assigns handlers for diffrent events of the model
    const { view: stage } = this;
    function addNode(this: Network): void {
      // TODO: the node id should be received from event data
      const nodeModel = this.nodes[this.nodes.length - 1]; // Finds the added node
      const nodeConfig = {
        name: nodeModel.name,
        inputs: [...nodeModel.inputs].map((socket: InputSocket) => {
          const result : {name: string | null; title: string | null; value?: JsonValue} = {
            name: socket.name,
            title: socket.title,
          };
          if (!socket.isDefaultNothing()) result.value = socket.getJsonDefaultValue();
          return result;
        }),
      };
      const nodeUI = new NodeUI(stage, nodeConfig);
      const nodeCtr = new NodeController(nodeModel, nodeUI);
      stage.debug[`node-${nodeModel.name}`] = nodeUI; // References to NodeUI instances for debugging purposes
    }
    this.model.addEventListener('addNode', addNode);
  }
}

export { NetworkController, NodeController };
