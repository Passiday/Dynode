class StageUI {
  svgb: SVGBuilder;

  name = 'Node';

  debug: { [key: string]: unknown } = {};

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
  }
}

export default StageUI;
