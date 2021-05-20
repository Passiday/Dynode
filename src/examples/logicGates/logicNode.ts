import { NodeView } from 'src/Dynode/view';

export default class LogicGateUI extends NodeView {
  public redraw(): void {
    // Redraw the node UI
    this.container.wipe();

    if (['OrGate', 'AndGate', 'XORGate'].includes(this.name)) {
      this.stage.svgb.draggable(this.container);
      const andNode = this.container.addGroup();
      andNode.scale(0.2, 0.2);
      andNode.addSVGBFile({}, `svg/${this.name}.svg`, () => {
      });
      return;
    }
    super.redraw();
  }
}
