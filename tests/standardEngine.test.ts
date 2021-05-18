import { JsonValue } from 'src/utils/objectUtils';
import { Engine as StandardEngine } from 'src/Dynode/model/standard';
import { ValueType } from 'src/Dynode/model/core/socket';
import { NodeType } from 'src/Dynode/model/core';
import type { Node } from 'src/Dynode/model/core';

describe('getNodeTypeDefinition', () => {
  test('Ensure math node type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getNodeTypeDefinition('math')).not.toThrow();
  });

  test('Ensure const node type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getNodeTypeDefinition('const')).not.toThrow();
  });

  test('Ensure burger node does not exist', () => {
    const e = new StandardEngine();
    expect(() => e.getNodeTypeDefinition('burger')).toThrow();
  });
});

describe('getValueTypeDefinition', () => {
  test('Ensure number type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure boolean type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('boolean')).not.toThrow();
  });

  test('Ensure string type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure unknown type throws', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('Object')).toThrow();
  });

  test('Ensure types are case sensitive', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
    expect(() => e.getValueTypeDefinition('String')).toThrow();
  });
});

describe('addNodeTypeDefinition', () => {
  function getSampleNodeType() {
    return new NodeType(
      'sample',
      ((node: Node) => {
        const thisNode = node;
        thisNode.addInput('in');
        thisNode.addOutput('result');
        thisNode.action = function (this: Node) {
          this.setOutputValue('result', this.getInputValue('in'));
        };
        return thisNode;
      }),
    );
  }

  test('A nodeType can be added', () => {
    const e = new StandardEngine();
    const n = getSampleNodeType();

    expect(() => e.addNodeTypeDefinition(n)).not.toThrow();
  });

  test('Ensure duplicate names throw', () => {
    const e = new StandardEngine();
    const n1 = getSampleNodeType();
    expect(() => e.addNodeTypeDefinition(n1)).not.toThrow();

    const n2 = getSampleNodeType();
    expect(() => e.addNodeTypeDefinition(n2)).toThrow();
  });
});

describe('addValueTypeDefinition', () => {
  test('A valueType can be added', () => {
    const e = new StandardEngine();

    class VT extends ValueType {
      public check(value: unknown): boolean {
        return (typeof value === 'number' && value % 2 === 0)
      }

      public toJSON(value: unknown): JsonValue {
        return value as number
      }
    }

    const vt = new VT();
    expect(() => e.addValueTypeDefinition('even', vt)).not.toThrow();
  });

  test('Ensure duplicate names throw', () => {
    const e = new StandardEngine();
    class VT extends ValueType {
      public check(value: unknown): boolean {
        return (typeof value === 'number' && value % 2 === 0)
      }

      public toJSON(value: unknown): JsonValue {
        return value as number
      }
    }

    const v1 = new VT();
    const v2 = new VT();

    expect(() => e.addValueTypeDefinition('even', v1)).not.toThrow();
    expect(() => e.addValueTypeDefinition('even', v2)).toThrow();
  });
});
