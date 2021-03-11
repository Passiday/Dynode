import Network from './network';
import Node from './node';
import { NetworkController } from './dynodeController';
import { StageUI } from './DynodeUI';

// Temporarily, the network and stage will be published to the global scope
// so they can be manipulated from the console

const network = new Network();
const stageContainer = document.getElementById('dynodeContainer');
if (stageContainer === null) throw new Error('dynodeContainer element does not exist.');
const stage = new StageUI(stageContainer);

function controllerExample(): NetworkController {
  const controller = new NetworkController(network, stage);

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
  network.addNode(sumNode);

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
  network.addNode(nodeParams);
  // n.resolve();
  // n.removeNode(sumNode);
  // n.removeNode(nodeParams);
  return controller;
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  controllerExample,
});
