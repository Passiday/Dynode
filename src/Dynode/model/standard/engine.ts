import { Engine } from '../core';
import { ValueConstructor } from '../core/socket/value';
import * as V from './valueDefinitions';
import NodeTypeDefinitions from './nodeTypeDefinitions';

class StandardEngine extends Engine {
  constructor() {
    super();
    for (const nodeType of NodeTypeDefinitions) {
      this.addNodeTypeDefinition(nodeType);
    }
    for (const [name, value] of Object.entries({
      number: V.Number,
      boolean: V.Boolean,
      string: V.String,
    } as Record<string, ValueConstructor<unknown>>)) this.addValueDefinition(name, value);
  }
}

export default StandardEngine;
