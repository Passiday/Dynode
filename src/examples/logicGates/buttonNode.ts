import { NodeView } from 'src/Dynode/view';
import type { JsonObject } from 'src/utils/objectUtils';

export default class ButtonUI extends NodeView {
  public redraw(): void {
    super.redraw();
    const inputConfigList = 'inputs' in this.config ? <[JsonObject]> this.config.inputs : [];
    inputConfigList.forEach((inputConfig) => {
      this.updateInputs(inputConfig);
    });
  }

  public updateInputs(inputStates: JsonObject): void {
    const value = inputStates.value as number;
    if (value === 1) {
      this.container.wipe();
      this.stage.svgb.draggable(this.container);
      const andNode = this.container.addGroup();
      andNode.scale(0.2, 0.2);
      andNode.addSVGBFile({}, 'svg/SwitchOn.svg', () => {
      });
      andNode.setAttributes({
        onclick: () => this.updateInputs({
          value: 0,
        }),
      });
    } else if (value === 0) {
      this.container.wipe();
      this.stage.svgb.draggable(this.container);
      const andNode = this.container.addGroup();
      andNode.scale(0.2, 0.2);
      andNode.addSVGBFile({}, 'svg/SwitchOff.svg', () => {
      });
      andNode.setAttributes({
        onclick: () => this.updateInputs({
          value: 1,
        }),
      });
    } else {
      super.updateInputs(inputStates);
    }
  }
}
