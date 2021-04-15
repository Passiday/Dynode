import StandardEngine from '../src/standardEngine';
import ValueType from '../src/valueType';
import NodeType from '../src/nodeType';
import type Node from '../src/node';

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
    const v = new ValueType(
      'even',
      (val: unknown) => typeof (val) === 'number' && val % 2 === 0,
    );
    expect(() => e.addValueTypeDefinition(v)).not.toThrow();
  });

  test('Ensure duplicate names throw', () => {
    const e = new StandardEngine();
    const v1 = new ValueType(
      'even',
      (val: unknown) => typeof (val) === 'number' && val % 2 === 0,
    );
    const v2 = new ValueType(
      'even',
      (val: unknown) => typeof (val) === 'number' && val % 2 === 0,
    );

    expect(() => e.addValueTypeDefinition(v1)).not.toThrow();
    expect(() => e.addValueTypeDefinition(v2)).toThrow();
  });
});
