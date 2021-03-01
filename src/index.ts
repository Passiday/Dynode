import Network from './network';
import Node from './node';
import { NetworkController } from './dynodeController';

const n = new Network();

function controllerExample(): NetworkController {
  const htmlElement = document.getElementById('dynodeContainer');
  if (htmlElement === null) throw Error('Can\'t find the dynodeContainer element.');
  const controller = new NetworkController(n, htmlElement);

  const sumNode = new Node('Sum'); // Creates sum node;
  sumNode.addInput('x');
  sumNode.addInput('y');
  sumNode.addOutput('result');
  sumNode.action = function (this: Node) {
    if (this.inputIsNothing('x')) return;
    if (this.inputIsNothing('y')) return;
    const x = this.getInputValue('x') as number;
    const y = this.getInputValue('y') as number;
    this.setOutputValue('result', x + y);
  };
  n.addNode(sumNode);

  const nodeParams: Node = new Node('Params'); // Creates param node;
  nodeParams.addInput('x').setDefaultValue(4);
  nodeParams.addInput('y').setDefaultValue(3);
  nodeParams.addOutput('x');
  nodeParams.addOutput('y');
  nodeParams.action = function (this: Node) {
    if (this.inputIsNothing('x')) return;
    if (this.inputIsNothing('y')) return;
    this.setOutputValue('x', this.getInputValue('x'));
    this.setOutputValue('y', this.getInputValue('y'));
  };
  sumNode.linkInput('x', nodeParams.getOutput('x'));
  sumNode.linkInput('y', nodeParams.getOutput('y'));
  n.addNode(nodeParams);
  // n.resolve();
  // n.removeNode(sumNode);
  // n.removeNode(nodeParams);
  return controller;
}

global.publishToGlobal({
  demoNetwork: n,
  controllerExample,
});
