import { NodeUI } from './nodeUI';

class StageUI {

  svgb: SVGBuilder;

  name: string = 'Node';

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
  }

  addNode(name?: string) {
    const node = new NodeUI(this, name);
    return node;
  }
}

export { StageUI };