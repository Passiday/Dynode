import { VEvent, VEventTarget } from '../vanillaEvent';
import StageUI from './stageUI';

class SocketUI extends VEventTarget {
  stage: StageUI;

  container: SVGBGroup;

  x: number;

  y: number;

  p: SVGBGroup;

  constructor(stage: StageUI, x: number, y: number) {
    super();

    this.stage = stage;
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.stage.addSnapPoint(this.x, this.y, this);

    this.container = stage.svgb.addGroup({ class: 'link' });
    this.p = this.container.addGroup({ class: 'socket' });
    this.p.addCircle({
      x: 0,
      y: 0,
      r: 25,
      style: { fill: '#F22' },
    });
    const pd = this.stage.svgb.draggable(this.p);
    pd.addEventListener('move', (evt: SVGBDraggableEvent) => {
      const dg = evt.target;
      this.x = dg.xBody;
      this.y = dg.yBody;

      this.dispatchEvent(new VEvent('move', { detail: { x: this.x, y: this.y } }));
    });

    this.update();
  }

  update(): void {
    this.p.translate(this.x, this.y);
  }

  remove(): void {
    this.container.remove();
  }
}

export default SocketUI;
