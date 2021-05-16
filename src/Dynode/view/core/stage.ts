import type { JsonObject } from 'src/utils/objectUtils';
import type Node from './node';

interface NodeConstructor {
  new(stage: Stage, config?: JsonObject): Node;
}

class Stage {
  private types: {[type: string]: NodeConstructor} = {};

  svgb: SVGBuilder;

  name = 'Node';

  debug: { [key: string]: unknown } = {};

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
  }

  public addNodeType(type: string, ctor: NodeConstructor): void {
    this.types[type] = ctor;
  }

  public getNodeType(type: string): NodeConstructor {
    const typeClass = this.types[type];
    if (!typeClass) throw new Error(`Type ${type} does not exist!`);
    return typeClass;
  }

  public nodeTypeExists(type: string): boolean {
    return (type in this.types);
  }
}

export default Stage;
