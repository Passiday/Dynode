import type { JsonObject } from 'src/utils/objectUtils';
import type NodeUI from './nodeUI';

interface NodeUIConstructor {
  new(stage: StageUI, config?: JsonObject): NodeUI;
}

class StageUI {
  private types: {[type: string]: NodeUIConstructor} = {};

  svgb: SVGBuilder;

  name = 'Node';

  debug: { [key: string]: unknown } = {};

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
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
    return (type in this.types);
  }
}

export default StageUI;
