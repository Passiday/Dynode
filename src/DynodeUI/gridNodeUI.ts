import NodeUI from './nodeUI';
import type StageUI from './stageUI';

class GridNodeUI extends NodeUI {
  constructor(stage: StageUI, name?: string) {
    super(stage, name);
    this.redraw();
  }

  private addSVGGrid(): void {
    const xOffset = 0; // px
    const yOffset = 25; // px
    const height = 30; // px
    const width = 30; // px
    const spacing = 2; // px
    const rows = 3; // count
    const cols = 3; // count

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const a = this.container.addRect({
          x: xOffset + col * width + spacing * col,
          y: yOffset + row * height + spacing * row,
          height,
          width,
        });
        a.setAttributes({ style: { fill: 'green' } });
        if (row === 1 && col === 1) {
          a.setAttributes({ style: { fill: 'red' } });
        }
      }
    }
  }

  redraw(): void {
    this.container.wipe();
    this.frame = this.container.addRect({
      x: 0, y: 0, width: 200, height: 150, class: 'body',
    });
    const titleBar = this.container.addRect({
      x: 0, y: 0, width: 200, height: 25, class: 'titleBar',
    });
    this.stage.svgb.draggable(titleBar, this.container);
    this.container.addText({ x: 5, y: 20, class: 'titleBarText' }, this.name);

    this.addSVGGrid();
  }

  public inputsReady(x: number, y: number): void {
    console.log(`x is ${x}; y is ${y}`);
  }
}

export default GridNodeUI;
