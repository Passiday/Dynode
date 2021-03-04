import Node from '../src/node';
import OutputSocket from '../src/outputSocket';

test('unlinkedNodeTest', () => {
  const node = new Node('Node-A');
  const input1 = node.addInput('one');
  const input2 = node.addInput('two');
  const output1 = node.addOutput('one');
  input1.setDefaultValue(123);
  input2.setDefaultValue();
  output1.addEventListener('value', function (this: OutputSocket) {
    expect(this.isNothing()).toBe(true);
  });
  node.resolve();
});

test('linkedNodesTest', () => {
  // Node A: one input, one output
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  const outputA1 = nodeA.addOutput('one');
  nodeA.action = () => {
    if (!nodeA.inputIsNothing('one')) {
      const inputOne = nodeA.getInputValue('one');
      nodeA.setOutputValue('one', inputOne);
    }
  };

  // Node B: two inputs, no outputs
  const nodeB = new Node('Node-B');
  const inputB1 = nodeB.addInput('one');
  const inputB2 = nodeB.addInput('two');
  inputB1.setDefaultValue(456);
  inputB2.setDefaultValue();

  nodeB.resolve();
  expect(inputB1.getValue()).toBe(456);

  inputB1.linkSocket(outputA1);
  nodeB.resolve();
  expect(inputB1.getValue()).toBe(123);
});
test('linkedNodesTestAsync', (done) => {
  // Node A: one input, one output
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  const outputA1 = nodeA.addOutput('one');
  nodeA.action = () => {
    const p = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!nodeA.inputIsNothing('one')) {
          const inputOne = nodeA.getInputValue('one');
          nodeA.setOutputValue('one', inputOne);
        }
        resolve();
      }, 0);
    });
    return p;
  };

  // Node B: one input, no outputs
  const nodeB = new Node('Node-B');
  const inputB1 = nodeB.addInput('one');
  inputB1.setDefaultValue(456);

  nodeB.resolve();
  expect(inputB1.getValue()).toBe(456);

  const check = () => {
    expect(inputB1.getValue()).toBe(123);
    done();
  };
  inputB1.linkSocket(outputA1);
  inputB1.addEventListener('value', check);
  nodeB.preResolve();
  nodeB.resolve();
  expect(nodeB.busy).toBe(true);
  expect(nodeB.resolved).toBe(false);
  expect(() => inputB1.getValue()).toThrow(Error);
});

test('NodeError', () => {
  // Node A: one input
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  nodeA.action = () => {
    throw new Error('TestError');
  };

  const outcome = jest.fn();

  function endTest() {
    expect(outcome).toHaveBeenCalledTimes(1);
    expect(outcome).toHaveBeenCalledWith(false);
  }

  nodeA.addEventListener('afterResolve', () => {
    outcome(true);
    endTest();
  });
  nodeA.addEventListener('error', () => {
    outcome(false);
    endTest();
  });
  nodeA.resolve();
});

test('NodeErrorAsync', (done) => {
  // Node A: one input
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  nodeA.action = () => {
    const p = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('TestError'));
      }, 0);
    });
    return p;
  };

  const outcome = jest.fn();

  function endTest() {
    expect(outcome).toHaveBeenCalledTimes(1);
    expect(outcome).toHaveBeenCalledWith(false);
    done();
  }

  nodeA.addEventListener('afterResolve', () => {
    outcome(true);
    endTest();
  });
  nodeA.addEventListener('error', () => {
    outcome(false);
    endTest();
  });
  nodeA.resolve();
});
