import { Engine } from '../core';
import ValueTypeDefinitions from './valueTypeDefinitions';
import NodeTypeDefinitions from './nodeTypeDefinitions';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of NodeTypeDefinitions) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const valueType of ValueTypeDefinitions) this.addValueTypeDefinition(valueType);
  }
}

export default StandardEngine;
