import { Node, NodeType, Engine } from 'src/Dynode/model';
import { NetworkController } from 'src/Dynode/controller';
import type { Network } from 'src/Dynode/model';
import type { StageView } from 'src/Dynode/view';
import NodeUI from './logicNode';

export default function logicNodeExample(network: Network, stage: StageView, name = 'OrGate'): NetworkController {
  const controller = new NetworkController(network, stage);
  // eslint-disable-next-line no-param-reassign
  network.engine = new Engine();
  stage.addNodeType('logicGate', NodeUI);

  network.engine.addNodeTypeDefinition(new NodeType(
    'logicGate',
    ((node: Node) => {
      const logicNode = node;
      logicNode.addInput('x', 'number');
      logicNode.addInput('y', 'number');
      logicNode.addOutput('result', 'number');
      logicNode.action = function (this: Node) {
        if (this.inputIsNothing('x')) return;
        if (this.inputIsNothing('y')) return;
        const x = this.getInputValue('x') as number;
        const y = this.getInputValue('y') as number;
        switch (this.name) {
          // eslint-disable-next-line no-bitwise
          case 'AndGate': this.setOutputValue('result', (x & y));
            break;
            // eslint-disable-next-line no-bitwise
          case 'OrGate': this.setOutputValue('result', (x | y));
            break;
            // eslint-disable-next-line no-bitwise
          case 'XORGate': this.setOutputValue('result', (x ^ y));
            break;
          default: throw new Error('Undefined logic gate type');
            break;
        }
      };
      return logicNode;
    }),
  ));

  const logicNode = new Node(name, network, network.engine.getNodeTypeDefinition('logicGate')); // Creates sum node;
  network.addNode(logicNode);

  const outputNode = new Node('Output', network);
  outputNode.addInput('output', 'number');
  outputNode.linkInput('output', logicNode.getOutput('result'));
  network.addNode(outputNode);
  /* TODO:
  (PJ) We need a network.createNode() - currently we have to specify the network also
  in the Node constructor, for typed inputs to work.
  */

  const nodeParams: Node = new Node('Params', network); // Creates param node;
  nodeParams.addInput('x', 'number').setDefaultValue(1);
  nodeParams.addInput('y', 'number').setDefaultValue(0);
  nodeParams.addOutput('x', 'number');
  nodeParams.addOutput('y', 'number');
  nodeParams.action = function (this: Node) {
    if (this.inputIsNothing('x')) return;
    if (this.inputIsNothing('y')) return;
    this.setOutputValue('x', this.getInputValue('x'));
    this.setOutputValue('y', this.getInputValue('y'));
  };
  logicNode.linkInput('x', nodeParams.getOutput('x'));
  logicNode.linkInput('y', nodeParams.getOutput('y'));
  network.addNode(nodeParams);
  // n.resolve();
  // n.removeNode(sumNode);
  // n.removeNode(nodeParams);
  return controller;
}
