import StageUI from './stageUI';
import NodeUI from './nodeUI';
import GridNodeUI from './gridNodeUI';

class StandardStageUI extends StageUI {
  constructor(container: HTMLElement) {
    super(container);
    this.addNodeType('grid', GridNodeUI);
    this.addNodeType('default', NodeUI);
  }
}

export default StandardStageUI;
