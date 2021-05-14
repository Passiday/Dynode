import type StageUI from './stageUI';

class LinkUI {
  stage: StageUI;

  container: SVGBGroup;

  x1: number;

  y1: number;

  x2: number;

  y2: number;

  p1: SVGBGroup;

  p2: SVGBGroup;

  link: SVGBLine;

  constructor(stage: StageUI, x1:number, y1:number, x2:number, y2:number) {
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
    this.p1 = this.container.addGroup({ class: 'socket' });
    this.p1.addCircle({ x: 0, y: 0, r: 5 });
    const p1d = this.stage.svgb.draggable(this.p1);
    p1d.addEventListener('move', function (this: SVGBDraggable, evt: SVGBDraggableEvent) {
      linkLine.setAttributes({
        x1: Math.round(this.xLocal),
        y1: Math.round(this.yLocal),
      });
      this.setPosition({
        x: Math.round(this.xLocal),
        y: Math.round(this.yLocal),
      });
    });

    this.p2 = this.container.addGroup({ class: 'socket' });
    this.p2.addCircle({ x: 0, y: 0, r: 5 });
    const p2d = this.stage.svgb.draggable(this.p2);
    p2d.addEventListener('move', function (this:SVGBDraggable, evt: SVGBDraggableEvent) {
      linkLine.setAttributes({
        x2: Math.round(this.xLocal),
        y2: Math.round(this.yLocal),
      });
      this.setPosition({
        x: Math.round(this.xLocal),
        y: Math.round(this.yLocal),
      });
    });

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
