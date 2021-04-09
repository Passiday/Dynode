import Engine from './engine';
import StockNodeTypeDeclarations from './stockNodeTypeDeclarations';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of StockNodeTypeDeclarations) {
      this.addNodeTypeDefinition(nodeType);
    }
  }
}

export default StandardEngine;
