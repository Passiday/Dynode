import { Node } from 'src/Dynode/model/core';
import { NodeView } from 'src/Dynode/view';
import { VEvent } from 'src/utils/vanillaEvent';
import { JsonObject } from 'src/utils/objectUtils';

export default class NodeController {
  model: Node;

  view: NodeView;

  constructor(model: Node, view: NodeView) {
    this.model = model;
    this.view = view;
    this.addHandlers();
  }

  addHandlers(): void { // Init model event handlers
    const { view: nodeUI, model: node } = this;
    function afterResolve(this: Node): void {
      let s = '';
      this.outputs.getAllSockets().forEach((output) => {
        s += `Output ${output.name}: ${output.isNothing() ? 'nothing' : output.getValue()}, `;
      });
      nodeUI.setInfo(s);
    }
    function inputsReady(this: Node): void {
      const inputConfig: JsonObject = {};
      this.inputs.getAllSockets().forEach((input) => {
        if (!input.isNothing() && input.name !== null) {
          inputConfig[input.name] = {
            value: input.getJsonValue(),
          };
        }
      });
      nodeUI.updateInputs(inputConfig);
    }
    function nodeRemoved(this: Node): void {
      nodeUI.remove();
    }
    this.model.addEventListener('inputsReady', inputsReady);
    this.model.addEventListener('afterResolve', afterResolve);
    this.model.addEventListener('nodeRemoved', nodeRemoved); // Perhaps this event belongs to the Network model?
    // TODO Handle "nothing" in inputChange
    this.view.addEventListener('inputChange', (ev: VEvent<NodeView>) => {
      for (const [key, value] of Object.entries(ev.detail as Record<string, unknown>)) {
        node.getInput(key).setDefaultValue(value);
      }
    });
  }
}
