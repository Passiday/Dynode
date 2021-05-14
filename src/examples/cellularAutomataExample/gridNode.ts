import { NodeUI } from 'src/Dynode/view';
import type { StageUI } from 'src/Dynode/view';
import type { JsonObject } from 'src/utils/objectUtils';

interface ObjectWithValue {
  value: unknown,
}

export default class GridNodeUI extends NodeUI {
  /**
   * Reference to grid's svg rectangles that represent the grid.
   */
  private rectCells!: SVGBRect[][];

  /**
   * The X coordinate of the currently colored cells
   */
  private currentX: number;

  /**
   * The Y coordinate of the currently colored cells
   */
  private currentY: number;

  constructor(stage: StageUI, config?: JsonObject) {
    super(stage, config);
    this.currentX = 0;
    this.currentY = 0;
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
    const rootContainer = this.addSection();
    const rootContainerSvgb = new SVGBuilder({ class: 'grid-box' });
    const gridContainer = rootContainerSvgb.addGroup();
    rootContainerSvgb.insert(rootContainer);

    for (let row = 0; row < rows; row++) {
      rects[row] = new Array(cols);

      for (let col = 0; col < cols; col++) {
        const svgCell = gridContainer.addRect({
          x: xOffset + col * width + spacing * col,
          y: yOffset + row * height + spacing * row,
          height,
          width,
        });

        rects[row][col] = svgCell;

        svgCell.setAttributes({
          class: 'cell',
          onclick: () => this.updateInputs({
            x: { value: col },
            y: { value: row },
          }),
        });
      }
    }

    this.rectCells = rects;
  }

  public redraw(): void {
    super.redraw();
    this.addSVGGrid();
    this.updateHeight();
  }

  public updateInputs(inputStates: JsonObject): void {
    super.updateInputs(inputStates);
    const xWrapper = inputStates.x as unknown as ObjectWithValue;
    const yWrapper = inputStates.y as unknown as ObjectWithValue;

    this.currentX = ((xWrapper && xWrapper.value !== null)
      ? xWrapper.value : this.currentX) as number;
    this.currentY = ((yWrapper && yWrapper.value !== null)
      ? yWrapper.value : this.currentY) as number;

    const x = this.currentX;
    const y = this.currentY;

    if (x < 0 || x > 3) throw new Error('X is not 0, 1 or 2!');
    if (y < 0 || y > 3) throw new Error('y is not 0, 1 or 2!');
    if (!this.rectCells) return;

    // Reset cell state
    for (const row of this.rectCells) {
      for (const col of row) {
        col.element.classList.remove('active-cell');
      }
    }

    this.rectCells[y][x].element.classList.add('active-cell');
  }
}
