import Network from './network';
import Node from './node';
import { NetworkController } from './dynodeController';
import { StageUI, NodeUI, LinkUI } from './DynodeUI';
import './main.scss';

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

function easterEggwork(): NetworkController {
  const controller = new NetworkController(network, stage);

  function createRandomRGBNode(name: string): Node {
    const node = new Node(name);
    node.addOutput('rrggbb');
    node.action = function (this: Node) {
      this.setOutputValue('rrggbb', Math.floor(Math.random() * 0x1000000).toString(16));
    };
    return node;
  }

  const nodeColor1 = createRandomRGBNode('Color1');
  const nodeColor2 = createRandomRGBNode('Color2');
  const nodeColor3 = createRandomRGBNode('Color3');
  network.addNode(nodeColor1);
  network.addNode(nodeColor2);
  network.addNode(nodeColor3);

  const eggNode = new Node('Egg');
  eggNode.addInput('a').setDefaultValue('ffffff');
  eggNode.addInput('b').setDefaultValue('ffffff');
  eggNode.addInput('c').setDefaultValue('ffffff');
  network.addNode(eggNode);

  eggNode.linkInput('a', nodeColor1.getOutput('rrggbb'));
  eggNode.linkInput('b', nodeColor2.getOutput('rrggbb'));
  eggNode.linkInput('c', nodeColor3.getOutput('rrggbb'));

  return controller;
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  NodeUI,
  LinkUI,
  controllerExample,
  easterEggwork,
});
