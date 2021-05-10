import StandardEngine from './standardEngine';
import Network from './network';
import Node from './node';
import NodeType from './nodeType';
import { NetworkController } from './dynodeController';
import { StageUI, NodeUI, LinkUI } from './DynodeUI';
import './main.scss';

// Temporarily, the network and stage will be published to the global scope
// so that they can be manipulated from the console

const engine = new StandardEngine();
const network = new Network('network', engine); // TODO: (PJ) I'd like to do engine.createNetwork() instead. Also, I don't think the networks need names.
const stageContainer = document.getElementById('dynodeContainer');
if (stageContainer === null) throw new Error('dynodeContainer element does not exist.');
const stage = new StageUI(stageContainer);

function controllerExample(): NetworkController {
  const controller = new NetworkController(network, stage);

  const sumNode = new Node('Sum', network); // Creates sum node;
  sumNode.addInput('x', 'number');
  sumNode.addInput('y', 'number');
  sumNode.addOutput('result', 'number');
  sumNode.action = function (this: Node) {
    if (this.inputIsNothing('x')) return;
    if (this.inputIsNothing('y')) return;
    const x = this.getInputValue('x') as number;
    const y = this.getInputValue('y') as number;
    this.setOutputValue('result', x + y);
  };
  network.addNode(sumNode);
  /* TODO:
  (PJ) We need a network.createNode() - currently we have to specify the network also
  in the Node constructor, for typed inputs to work.
  */

  const nodeParams: Node = new Node('Params', network); // Creates param node;
  nodeParams.addInput('x', 'number').setDefaultValue(4);
  nodeParams.addInput('y', 'number').setDefaultValue(3);
  nodeParams.addOutput('x', 'number');
  nodeParams.addOutput('y', 'number');
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

function multiCycleExample() : void {
  const coalesceNode = new Node('Coalesce');
  coalesceNode.addInput('x');
  coalesceNode.addOutput('result');
  coalesceNode.action = function (this: Node) {
    if (this.inputIsNothing('x')) {
      this.setOutputValue('result', 1);
      return;
    }
    this.setOutputValue('result', this.getInputValue('x'));
  };
  network.addNode(coalesceNode);

  const logNode = new Node('Log');
  logNode.addInput('parameters');
  logNode.action = function (this: Node) {
    if (!this.inputIsNothing('parameters')) console.log(`Log node: ${logNode.getInputValue('parameters')}`);
  };
  logNode.linkInput('parameters', coalesceNode.getOutput('result'));
  network.addNode(logNode);

  const incrementNode = new Node('Increment');
  incrementNode.addInput('x');
  incrementNode.addOutput('y');
  incrementNode.action = function (this: Node) {
    if (this.inputIsNothing('x')) return;
    let v = this.getInputValue('x') as number;
    v++;
    this.setOutputValue('y', v);
  };
  incrementNode.linkInput('x', coalesceNode.getOutput('result'));
  network.addNode(incrementNode);

  const ifNode = new Node('If');
  ifNode.addInput('x');
  ifNode.addOutput('y');
  ifNode.action = function (this:Node) {
    if (this.inputIsNothing('x')) return;
    const v = this.getInputValue('x') as number;
    if (v < 6) {
      this.setOutputValue('y', v);
    }
  };
  ifNode.linkInput('x', incrementNode.getOutput('y'));
  network.addNode(ifNode);
  const delay = new Node('Delay');
  delay.addInput('x');
  delay.addOutput('y', undefined, true);
  delay.action = function () {
    if (this.inputIsNothing('x')) return;
    const input = this.getInputValue('x') as number;
    this.setOutputValue('y', input);
  };
  delay.linkInput('x', ifNode.getOutput('y'));
  coalesceNode.linkInput('x', delay.getOutput('y'));
  network.addNode(delay);
  // network.resolve();
}

function cellularAutomataExample() {
  const controller = new NetworkController(network, stage);
  network.engine = new StandardEngine();
  network.engine.addNodeTypeDefinition(new NodeType(
    'grid',
    ((node: Node) => {
      const n = node;
      n.addInput('x', 'number').setDefaultValue(0);
      n.addInput('y', 'number').setDefaultValue(0);
      n.addOutput('result');
      n.action = function (this: Node) {
        // TODO
      };
      return n;
    }),
  ));
  const n1 = new Node('grid1', network, network.engine.getNodeTypeDefinition('grid'));
  network.addNode(n1);
  network.resolve().then(() => {
    // This "then" clause checks whether grid is updated properly
    n1.inputs.getSocketByName('x').setDefaultValue(1);
    n1.inputs.getSocketByName('y').setDefaultValue(2);
    network.resolve();
  });

  return controller;
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  NodeUI,
  LinkUI,
  controllerExample,
  multiCycleExample,
  cellularAutomataExample,
});
