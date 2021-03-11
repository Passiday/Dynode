import Network from './network';
import Node from './node';
import { StageUI, NodeUI } from './DynodeUI';
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
      Object.keys(this.outputs).forEach((outputName) => {
        const output = this.getOutput(outputName);
        s += `Output ${outputName}: ${output.isNothing() ? 'nothing' : output.getValue()}, `;
      });
      nodeUI.setInfo(s);
    }
    function nodeRemoved(this: Node): void {
      nodeUI.remove();
    }
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
      const nodeUI = stage.addNode(nodeModel.name);
      const nodeCont = new NodeController(nodeModel, nodeUI); // Creates node controller
    }
    this.model.addEventListener('addNode', addNode);
  }
}

export { NetworkController, NodeController };
