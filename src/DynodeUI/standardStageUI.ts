import StageUI from './stageUI';
import NodeUI from './nodeUI';

class StandardStageUI extends StageUI {
  constructor(container: HTMLElement) {
    super(container);
    this.addNodeType('default', NodeUI);
  }
}

export default StandardStageUI;
