import { Network } from 'src/Dynode/model/core';
import { StageView } from 'src/Dynode/view';
import { JsonValue } from 'src/utils/objectUtils';
import { InputSocket } from 'src/Dynode/model/core/socket';
import NodeController from './node';

export default class NetworkController {
  model: Network;

  view: StageView;

  constructor(model: Network, view: StageView) {
    this.model = model;
    this.view = view;

    this.addHandlers();
    // TODO implement controller initialization for already populated network
  }

  addHandlers(): void { // Function that assigns handlers for diffrent events of the model
    const { view: stage } = this;
    function addNode(this: Network): void {
      // TODO: the node id should be received from event data
      const nodeModel = this.nodes[this.nodes.length - 1]; // Finds the added node
      const nodeConfig = {
        name: nodeModel.name,
        inputs: [...nodeModel.inputs].map((socket: InputSocket<unknown>) => {
          const result : {name: string | null; title: string | null; value?: JsonValue} = {
            name: socket.name,
            title: socket.title,
          };
          if (socket.isDefaultSet() && !socket.isDefaultNothing()) {
            result.value = socket.getValue().toJSON();
          }
          return result;
        }),
      };
      const nodeTypeName = nodeModel.nodeType?.name || 'default';
      const NodeUIConstructor = stage.getNodeType(nodeTypeName);
      const nodeUI = new NodeUIConstructor(stage, nodeConfig);
      const nodeCtr = new NodeController(nodeModel, nodeUI);
      stage.debug[`node-${nodeModel.name}`] = nodeUI; // References to NodeUI instances for debugging purposes
    }
    this.model.addEventListener('addNode', addNode);
  }
}
