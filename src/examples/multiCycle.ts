import { Node } from 'src/Dynode/model';
import type { Network } from 'src/Dynode/model';
import type { StageView } from 'src/Dynode/view';

export default function multiCycleExample(network: Network, stage: StageView) : void {
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
    let v = this.getInputValue('x').value as number;
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
    const v = this.getInputValue('x').value as number;
    if (v < 6) {
      this.setOutputValue('y', v);
    }
  };
  ifNode.linkInput('x', incrementNode.getOutput('y'));
  network.addNode(ifNode);
  const delay = new Node('Delay');
  delay.addInput('x');
  delay.addOutput('y', undefined, undefined, true);
  delay.action = function () {
    if (this.inputIsNothing('x')) return;
    const input = this.getInputValue('x').value as number;
    this.setOutputValue('y', input);
  };
  delay.linkInput('x', ifNode.getOutput('y'));
  coalesceNode.linkInput('x', delay.getOutput('y'));
  network.addNode(delay);
  // network.resolve();
}
