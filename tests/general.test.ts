import Engine from '../src/engine';
import Network from '../src/network';
import Node from '../src/node';

test('Engine passing test', () => {
  const engine = new Engine();
  const network = new Network('n', engine);
  const n1 = new Node('n1');

  network.addNode(n1);
  expect(() => n1.addInput('i1', 'number').setDefaultValue(2)).not.toThrow();
  expect(() => n1.addInput('i2', 'strng')).toThrow();
  expect(() => n1.getInput('i2')).toThrow(); // ensures that i2 is never made
  expect(() => n1.addInput('i2').setDefaultValue('meow')).not.toThrow();
  expect(() => n1.addOutput('o1', 'number')).not.toThrow();

  n1.action = function (this: Node) {
    const input1 = this.getInput('i1');
    const input2 = this.getInput('i2');
    expect(false).toBe(true); // This proves that the action is never executed
  };

  n1.resolve();
});
