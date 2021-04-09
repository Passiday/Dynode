import Engine from './engine';
import StockValueTypeDeclarations from './stockValueTypeDeclarations';
import StockNodeTypeDeclarations from './stockNodeTypeDeclarations';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of StockNodeTypeDeclarations) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const valueType of StockValueTypeDeclarations)
      this.addValueTypeDefinition(valueType);
  }
}

export default StandardEngine;
