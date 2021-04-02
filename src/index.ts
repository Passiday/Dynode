import Network from './network';
import Node from './node';
import { NetworkController } from './dynodeController';
import { StageUI, NodeUI, LinkUI } from './DynodeUI';
import { hasOwnProperty } from './objectUtils';
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

function multiCycleExample() : void {
  const coalesceNode = new Node('Coalesce');
  coalesceNode.addInput('x');
  coalesceNode.addOutput('result');
  coalesceNode.action = function (this: Node) {
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

  const delayRead = new Node('DelayRead');
  delayRead.addInput('x');
  delayRead.action = function (this:Node) {
    if (this.inputIsNothing('x')) return;
    this.keepState();
    if (this.state !== null) this.state.i = this.getInputValue('x') as number;
  };
  delayRead.linkInput('x', ifNode.getOutput('y'));
  network.addNode(delayRead);

  const delayWrite = new Node('DelayWrite');
  delayWrite.addInput('reader').setDefaultValue(delayRead);
  delayWrite.addOutput('i');
  delayWrite.action = function (this: Node) {
    const reader = this.getInputValue('reader');
    if (reader instanceof Node && reader.state !== null && hasOwnProperty(reader.state, 'i')) {
      if (reader.state.i === null) this.setOutputValue('i', 1);
      const i = reader.state.i as number;
      this.setOutputValue('i', i);
    } else this.setOutputValue('i', 1);
  };

  coalesceNode.linkInput('x', delayWrite.getOutput('i'));
  network.addNode(delayWrite);

  // network.resolve();
}

global.publishToGlobal({
  demoNetwork: network,
  demoStage: stage,
  NodeUI,
  LinkUI,
  controllerExample,
  multiCycleExample,
});
