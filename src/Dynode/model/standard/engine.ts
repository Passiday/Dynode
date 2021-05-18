import { Engine } from '../core';
import * as VT from './valueTypeDefinitions';
import NodeTypeDefinitions from './nodeTypeDefinitions';
import type ValueType from '../core/socket/valueType';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of NodeTypeDefinitions) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const [name, valueType] of Object.entries({
      number: new VT.Number(),
      boolean: new VT.Boolean(),
      string: new VT.String(),
    } as Record<string, ValueType>)) this.addValueTypeDefinition(name, valueType);
  }
}

export default StandardEngine;
