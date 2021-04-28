import Network from './network';
import Node from './node';
import { StageUI, NodeUI, GridNodeUI } from './DynodeUI';
import { VEvent } from './vanillaEvent';

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
      const inputValues: {[key: string]: unknown} = {};
      this.inputs.getAllSockets().forEach((input) => {
        if (!input.isNothing() && input.name !== null) inputValues[input.name] = input.getValue();
      });
      nodeUI.updateInputs(inputValues);
    }
    function nodeRemoved(this: Node): void {
      nodeUI.remove();
    }
    this.model.addEventListener('inputsReady', inputsReady);
    this.model.addEventListener('afterResolve', afterResolve);
    this.model.addEventListener('nodeRemoved', nodeRemoved); // Perhaps this event belongs to the Network model?
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

      function createNodeController(): NodeController {
        const nodeUI = new NodeUI(stage, nodeModel.name);
        return new NodeController(nodeModel, nodeUI);
      }

      const { nodeType } = nodeModel;
      if (nodeType === null) createNodeController();
      else {
        switch (nodeType.name) {
          case 'grid':
            new NodeController(nodeModel, new GridNodeUI(stage, nodeModel.name));
            break;
          default:
            createNodeController();
        }
      }
    }
    this.model.addEventListener('addNode', addNode);
  }
}

export { NetworkController, NodeController };
