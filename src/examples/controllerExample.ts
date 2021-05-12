import Node from '../node';
import { NetworkController } from '../dynodeController';
import type Network from '../network';
import type { StageUI } from '../DynodeUI';

export default function controllerExample(network: Network, stage: StageUI): NetworkController {
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
