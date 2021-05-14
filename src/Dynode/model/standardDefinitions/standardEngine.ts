import { Engine } from '../core';
import StandardValueTypeDefinitions from './standardValueTypeDefinitions';
import StandardNodeTypeDefinitions from './standardNodeTypeDefinitions';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of StandardNodeTypeDefinitions) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const valueType of StandardValueTypeDefinitions) this.addValueTypeDefinition(valueType);
  }
}

export default StandardEngine;
