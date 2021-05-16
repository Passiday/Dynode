import { Stage as CoreStage, Node } from '../core';

class Stage extends CoreStage {
  constructor(container: HTMLElement) {
    super(container);
    this.addNodeType('default', Node);
  }
}

export default Stage;
