import { VEventTarget, VEvent } from '../vanillaEvent';
import SocketUI from './socketUI';
import StageUI from './stageUI';

class LinkUI extends VEventTarget {
  stage: StageUI;

  container: SVGBGroup;

  x1: number;

  y1: number;

  x2: number;

  y2: number;

  p1: SVGBGroup;

  p2: SVGBGroup;

  link: SVGBLine;

  snapSocket1: SocketUI | null = null;

  snapSocket2: SocketUI | null = null;

  constructor(stage: StageUI, x1:number, y1:number, x2:number, y2:number) {
    super();

    this.stage = stage;
    this.x1 = Math.round(x1);
    this.y1 = Math.round(y1);
    this.x2 = Math.round(x2);
    this.y2 = Math.round(y2);

    this.container = stage.svgb.addGroup({ class: 'link' });
    const linkLine = this.container.addLine({
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    });
    this.link = linkLine;

    const sp1MoveEvent = (e: VEvent) => {
      const details = e.detail as {x: number, y: number};
      this.x1 = details.x;
      this.y1 = details.y;
      this.update();
    };

    const sp2MoveEvent = (e: VEvent) => {
      const details = e.detail as {x: number, y: number};
      this.x2 = details.x;
      this.y2 = details.y;
      this.update();
    };

    const dgEvent = (evt: SVGBDraggableEvent) => {
      const dg = evt.target;

      const isP1 = (dg.body === this.p1);

      let dist = 15; // Configurable snapping distance
      let p;
      for (const point of stage.snapPoints) {
        const d = Math.abs(point.x - dg.xLocal) + Math.abs(point.y - dg.yLocal);
        if (d <= dist) {
          dist = d;
          p = point;
        }
      }

      if (p) {
        dg.xBody = p.x;
        dg.yBody = p.y;
      }
      if (!dg.isSnapped()) {
        linkLine.setAttributes(isP1 ? {
          x1: dg.xBody,
          y1: dg.yBody,
        } : {
          x2: dg.xBody,
          y2: dg.yBody,
        });
      }
      if (p) {
        if (!dg.isSnapped()) {
          dg.snap({ x: p.x, y: p.y });
          if (isP1) {
            this.snapSocket1 = p.socket;
            this.snapSocket1.addEventListener('move', sp1MoveEvent);
          } else {
            this.snapSocket2 = p.socket;
            this.snapSocket2.addEventListener('move', sp2MoveEvent);
          }
        }
      } else if (dg.isSnapped()) {
        dg.unsnap();
        if (isP1) {
          this.snapSocket1?.removeEventListener('move', sp1MoveEvent);
          this.snapSocket1 = null;
        } else {
          this.snapSocket2?.removeEventListener('move', sp2MoveEvent);
          this.snapSocket2 = null;
        }
      }
      if (isP1) {
        this.x1 = dg.xBody;
        this.y1 = dg.yBody;
      } else {
        this.x2 = dg.xBody;
        this.y2 = dg.yBody;
      }
    };

    this.p1 = this.container.addGroup({ class: 'socket' });
    this.p1.addCircle({ x: 0, y: 0, r: 10 });
    const p1d = this.stage.svgb.draggable(this.p1);
    p1d.addEventListener('move', dgEvent);

    this.p2 = this.container.addGroup({ class: 'socket' });
    this.p2.addCircle({ x: 0, y: 0, r: 10 });
    const p2d = this.stage.svgb.draggable(this.p2);
    p2d.addEventListener('move', dgEvent);

    this.update();
  }

  update(): void {
    this.p1.translate(this.x1, this.y1);
    this.p2.translate(this.x2, this.y2);
    this.link.setAttributes({
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    });
  }

  remove(): void {
    this.container.remove();
  }
}

export default LinkUI;
