import Network from './network';
import Node from './node';
import { VEvent } from './vanillaEvent';

class NodeController {
  model: Node;

  view: HTMLElement;

  constructor(model: Node, _view: HTMLElement) {
    this.model = model;
    this.view = _view;
    this.addHandlers();
  }

  addHandlers(): void { // Function that assigns handlers for diffrent events of the model
    const { view } = this;
    function created(this: Node): void {
      view.innerHTML = `Name: ${this.name}; `;
    }
    function resolved(this: Node): void {
      let s = '';
      Object.keys(this.outputs).forEach((outputName) => {
        const output = this.getOutput(outputName);
        s += `Output ${outputName}: ${output.isNothing() ? 'nothing' : output.getValue()}, `;
      });
      view.innerHTML = `Name: ${this.name}; ${s} \n`;
    }
    function removed(this: Node): void {
      const parent = view.parentElement;
      parent?.removeChild(view);
    }
    this.model.addEventListener('nodeAdded', created);
    this.model.addEventListener('afterResolve', resolved);
    this.model.addEventListener('nodeRemoved', removed);
  }
}

class NetworkController {
  model: Network;

  view: HTMLElement;

  constructor(model: Network, _view: HTMLElement) {
    this.model = model;
    this.view = _view;
    this.addHandlers();
  }

  addHandlers(): void { // Function that assigns handlers for diffrent events of the model
    const { view } = this;
    function created(this: Network): void {
      const div = document.createElement('div'); // Creates a new element to represent a node
      const node = this.nodes[this.nodes.length - 1]; // Finds the added node
      const nodeCont = new NodeController(node, div); // Creates nodecontroller
      view.appendChild(div);
      node.dispatchEvent(new VEvent('nodeAdded')); // Dispatches an event inside a node
    }
    this.model.addEventListener('addNode', created);
  }
}

export { NetworkController, NodeController };
