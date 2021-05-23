import { Engine } from '../core';
import { ValueConstructor } from '../core/socket/value';
import * as VT from './valueTypeDefinitions';
import * as V from './valueDefinitions';
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
    for (const [name, value] of Object.entries({
      number: V.Number,
      boolean: V.Boolean,
      string: V.String,
    } as Record<string, ValueConstructor<unknown>>)) this.addValueDefinition(name, value);
  }
}

export default StandardEngine;
