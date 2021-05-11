import NodeUI from './nodeUI';
import type StageUI from './stageUI';
import type { JsonObject } from '../objectUtils';

interface ObjectWithValue {
  value: unknown,
};


class GridNodeUI extends NodeUI {
  /**
   * Reference to grid's svg rectangles that represent the grid.
   */
  private rectCells!: SVGBRect[][];

  constructor(stage: StageUI, config?: JsonObject) {
    super(stage, config);
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

    const rects: SVGBRect[][] = new Array(rows);
    const gridContainer = this.stage.svgb.addGroup({class: 'gridContainer' });

    for (let row = 0; row < rows; row++) {
      rects[row] = new Array(cols);

      for (let col = 0; col < cols; col++) {
        const a = gridContainer.addRect({
          x: xOffset + col * width + spacing * col,
          y: yOffset + row * height + spacing * row,
          height,
          width,
        });
        rects[row][col] = a;
        a.setAttributes({ style: { fill: 'green' } });
      }
    }

    this.rectCells = rects;
  }

  public redraw(): void {
    super.redraw();
    this.addSVGGrid();
  }

  public updateInputs(inputStates: JsonObject): void {
    super.updateInputs(inputStates);
    const xWrapper = inputStates.x as unknown as ObjectWithValue;
    const yWrapper = inputStates.y as unknown as ObjectWithValue;

    if (!xWrapper || !xWrapper.value) return;
    if (!yWrapper || !yWrapper.value) return;

    const x = xWrapper.value as number;
    const y = yWrapper.value as number;
    console.log(`x is ${x}; y is ${y}`);
    if (x < 0 || x > 3) throw new Error('X is not 0, 1 or 2!');
    if (y < 0 || y > 3) throw new Error('y is not 0, 1 or 2!');
    if (!this.rectCells) return;

    // Reset colors
    for (const row of this.rectCells) {
      for (const col of row) {
        col.setAttributes({ style: { fill: 'green' } });
      }
    }

    console.log(`"y is ${y}"`);
    console.log(y);
    this.rectCells[y][x].setAttributes({ style: { fill: 'red' } });
  }
}

export default GridNodeUI;
