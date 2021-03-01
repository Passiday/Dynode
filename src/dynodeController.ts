import Network from './network';
import Node from './node';
import { VEvent } from './vanillaEvent';

class NodeController {
  model: Node;

  view: SVGBGroup;

  nodeBody: HTMLElement;

  constructor(model: Node, view: SVGBGroup) {
    this.model = model;
    this.view = view;
    this.addHandlers();
    this.nodeBody = document.createElement('div');
  }

  addHandlers(): void { // Function that assigns handlers for model events
    const { view: nodeView, nodeBody } = this;
    function afterResolve(this: Node): void {
      let s = '';
      Object.keys(this.outputs).forEach((outputName) => {
        const output = this.getOutput(outputName);
        s += `Output ${outputName}: ${output.isNothing() ? 'nothing' : output.getValue()}, `;
      });
      nodeBody.innerHTML = s;
    }
    function nodeRemoved(this: Node): void {
      nodeView.remove();
    }
    this.model.addEventListener('afterResolve', afterResolve);
    this.model.addEventListener('nodeRemoved', nodeRemoved); // Perhaps this event belongs to the Network model?
  }

  update(): void {
    // Redraw the node
    this.view.wipe();
    this.view.addRect({
      x: 0, y: 0, width: 200, height: 150, class: 'body',
    });
    this.view.addRect({
      x: 0, y: 0, width: 200, height: 25, class: 'titleBar',
    });
    this.view.addText({ x: 5, y: 20, class: 'titleBarText' }, `Name: ${this.model.name}; `);
    const fo = this.view.addForeignObject({
      x: 0, y: 25, width: 200, height: 125,
    });
    this.nodeBody = document.createElement('div');
    fo.element.appendChild(this.nodeBody);
    this.nodeBody.classList.add('nodeInfo');
    this.nodeBody.innerHTML = 'Hello, <strong>World</strong>. This is plain HTML in a <em>&lt;foreignObject&gt;</em> SVG element.';
  }
}

class NetworkController {
  model: Network;

  view: HTMLElement;

  svgb: SVGBuilder;

  constructor(model: Network, view: HTMLElement) {
    this.model = model;
    this.view = view;
    this.svgb = new SVGBuilder();
    this.svgb.insert(this.view);
    this.addHandlers();
    // TODO implement controller initialization for already populated network
  }

  addHandlers(): void { // Function that assigns handlers for diffrent events of the model
    const { svgb } = this;
    function addNode(this: Network): void {
      const nodeView = svgb.addGroup({ class: 'node' }); // Creates a new SVG group to represent a node
      svgb.draggable(nodeView);
      // TODO: the node id should be received from event data
      const nodeModel = this.nodes[this.nodes.length - 1]; // Finds the added node
      const nodeCont = new NodeController(nodeModel, nodeView); // Creates nodecontroller
      nodeCont.update();
    }
    this.model.addEventListener('addNode', addNode);
  }
}

export { NetworkController, NodeController };
