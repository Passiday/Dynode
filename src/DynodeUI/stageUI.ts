class StageUI {
  svgb: SVGBuilder;

  name = 'Node';

  constructor(container: HTMLElement) {
    this.svgb = new SVGBuilder();
    this.svgb.insert(container);
  }
}

export default StageUI;
