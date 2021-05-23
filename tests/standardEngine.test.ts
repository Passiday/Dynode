import { Engine as StandardEngine } from 'src/Dynode/model/standard';
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
