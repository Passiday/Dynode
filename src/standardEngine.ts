import Engine from './engine';
import StockNodeTypeDeclarations from './stockNodeTypeDeclarations';

class StandardEngine extends Engine {
  constructor() {
    this.nodeTypeDefinitions = StockNodeTypeDeclarations;
  }
}

export default StandardEngine;
