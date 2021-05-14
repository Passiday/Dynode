import { Node, NodeType } from 'src/Dynode/model/core';
import { StandardEngine } from 'src/Dynode/model/standardDefinitions';
import { NetworkController } from 'src/Dynode/dynodeController';
import type { Network } from 'src/Dynode/model/core';
import type { StageUI } from 'src/Dynode/view';
import './style.scss';
import GridNodeUI from './gridNode';

export default function cellularAutomataExample(
  network: Network, stage: StageUI,
) : NetworkController {
  const controller = new NetworkController(network, stage);
  // eslint-disable-next-line no-param-reassign
  network.engine = new StandardEngine();
  stage.addNodeType('grid', GridNodeUI);
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
