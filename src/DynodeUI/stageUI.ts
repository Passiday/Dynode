import NodeUI from './nodeUI';
import GridNodeUI from './gridNodeUI'

interface NodeUIConstructor {
  new(stage: StageUI, name: string): NodeUI;
}

class StageUI {
  private types: {[type: string]: NodeUIConstructor} = {};

  svgb: SVGBuilder;

  name = 'Node';

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
    this.addNodeType('grid', GridNodeUI);
    this.addNodeType('default', NodeUI);
  }

  public addNodeType(type: string, ctor: NodeUIConstructor): void {
    this.types[type] = ctor;
  }

  public getNodeType(type: string): NodeUIConstructor {
    const typeClass = this.types[type];
    if (!typeClass) throw new Error(`Type ${type} does not exist!`);
    return typeClass;
  }

  public nodeTypeExists(type: string): boolean {
    return !!this.types[type];
  }
}

export default StageUI;
