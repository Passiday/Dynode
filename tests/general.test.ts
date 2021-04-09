import StandardEngine from '../src/standardEngine';
import Network from '../src/network';
import Node from '../src/node';

test('Engine passing test', () => {
  const engine = new StandardEngine();
  const network = new Network('n', engine);
  const n1 = new Node('n1');

  network.addNode(n1);
  expect(() => n1.addInput('numberInput', 'number').setDefaultValue(2)).not.toThrow();
  expect(() => n1.addInput('i2', 'strng')).toThrow();
  expect(() => n1.getInput('i2')).toThrow(); // ensures that i2 is never made
  expect(() => n1.addInput('noTypeInput').setDefaultValue('meow')).not.toThrow();
  expect(() => n1.addOutput('o1', 'number')).not.toThrow();

  const errorCatcherFunc = jest.fn();

  n1.addEventListener('error', errorCatcherFunc);
  n1.action = function (this: Node) {
    this.setOutputValue('o1', this.getInput('noTypeInput'));
  };
  n1.resolve();
  // Expect to have gone through an error
  expect(errorCatcherFunc.mock.calls.length).toBe(1);

  n1.action = function (this: Node) {
    this.setOutputValue('o1', this.getInput('numberInput'));
  };
  n1.resolve();
  // Expect that new action doesn't call an error
  expect(errorCatcherFunc.mock.calls.length).toBe(1);
});
