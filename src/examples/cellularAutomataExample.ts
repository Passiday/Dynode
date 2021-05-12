import Node from '../node';
import NodeType from '../nodeType';
import StandardEngine from '../standardEngine';
import { NetworkController } from '../dynodeController';
import { NodeUI } from '../DynodeUI';
import type Network from '../network';
import type { StageUI } from '../DynodeUI';
import type { JsonObject } from '../objectUtils';
interface ObjectWithValue {
  value: unknown,
};


class GridNodeUI extends NodeUI {
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
    const rootContainerSvgb = new SVGBuilder();
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
          style: { fill: 'green' },
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

    this.currentX = ((xWrapper && xWrapper.value !== null) ? xWrapper.value : this.currentX) as number;
    this.currentY = ((yWrapper && yWrapper.value !== null) ? yWrapper.value : this.currentY) as number;

    const x = this.currentX;
    const y = this.currentY;

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

export default function cellularAutomataExample(network: Network, stage: StageUI) {
  const controller = new NetworkController(network, stage);
  network.engine = new StandardEngine();
  stage.addNodeType('grid', GridNodeUI);
  network.engine.addNodeTypeDefinition(new NodeType(
    'grid',
    ((node: Node) => {
      const n = node;
      n.addInput('x', 'number').setDefaultValue(0);
      n.addInput('y', 'number').setDefaultValue(0);
      n.addOutput('result');
      n.action = function (this: Node) {
        // TODO
      };
      return n;
    }),
  ));
  const n1 = new Node('grid1', network, network.engine.getNodeTypeDefinition('grid'));
  network.addNode(n1);
  network.resolve().then(() => {
    // This "then" clause checks whether grid is updated properly
    n1.inputs.getSocketByName('x').setDefaultValue(1);
    n1.inputs.getSocketByName('y').setDefaultValue(2);
    network.resolve();
  });

  return controller;
}
