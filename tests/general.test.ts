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

  const mockFunc = jest.fn();

  n1.addEventListener('error', mockFunc);

  n1.action = function (this: Node) {
    this.setOutputValue('o1', this.getInput('i2'));
  };

  n1.resolve();

  // Expect to have gone through an error
  expect(mockFunc.mock.calls.length).toBe(1);

  n1.action = function (this: Node) {
    this.setOutputValue('o1', this.getInput('i1'));
  };

  n1.resolve();

  // Expect that new action doesn't call an error
  expect(mockFunc.mock.calls.length).toBe(1);
});
