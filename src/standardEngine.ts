import Engine from './engine';
import StockValueTypeDefinitions from './stockValueTypeDefinitions';
import StockNodeTypeDefinitions from './stockNodeTypeDefinitions';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of StockNodeTypeDefinitions) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const valueType of StockValueTypeDefinitions) this.addValueTypeDefinition(valueType);
  }
}

export default StandardEngine;
