import Network from './network';
import Node from './node';
import { DynodeController } from './dynodeController';

const n = new Network();
const htmlElement = document.getElementById('dynodeContainer');
if (htmlElement === null) throw Error('HTMLElement is null');
const controller = new DynodeController(n, htmlElement);

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

const nodeParams = new Node('Params'); // Creates param node;
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
n.resolve();

// Test - does the removeNode work
// n.removeNode(sumNode);
// n.removeNode(nodeParams);

declare global { function publishToGlobal(assets: Record<string, unknown>):void; }
global.publishToGlobal({
  demoNetwork: n,
});
