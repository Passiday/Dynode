import { Node, NodeType, Engine } from 'src/Dynode/model';
import { NetworkController } from 'src/Dynode/controller';
import type { Network } from 'src/Dynode/model';
import type { StageView } from 'src/Dynode/view';
import LogicGateUI from './logicNode';
import ButtonUI from './buttonNode';

export default function logicNodeExample(network: Network, stage: StageView, name = 'OrGate'): NetworkController {
  const controller = new NetworkController(network, stage);
  // eslint-disable-next-line no-param-reassign
  network.engine = new Engine();
  stage.addNodeType('logicGate', LogicGateUI);
  stage.addNodeType('button', ButtonUI);

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

  network.engine.addNodeTypeDefinition(new NodeType(
    'button',
    ((node: Node) => {
      const button = node;
      // button.addInput('value', 'number');
      button.addOutput('result');
      button.addInput('value').setDefaultValue(0);
      button.action = function (this: Node) {
        if (this.inputIsNothing('value')) return;
        this.setOutputValue('result', this.getInputValue('value') as number);
      };
      return button;
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
  const button1 = new Node('button1', network, network.engine.getNodeTypeDefinition('button'));
  const button2 = new Node('button2', network, network.engine.getNodeTypeDefinition('button'));

  logicNode.linkInput('x', button1.getOutput('result'));
  logicNode.linkInput('y', button2.getOutput('result'));
  network.addNode(button1);
  network.addNode(button2);
  // n.resolve();
  // n.removeNode(sumNode);
  // n.removeNode(nodeParams);
  return controller;
}
