import Node from '../src/node';
import OutputSocket from '../src/outputSocket';
import { VEvent } from '../src/vanillaEvent';
import { hasOwnProperty } from '../src/objectUtils';
import Network from '../src/network';

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
  expect(nodeB.isResolved()).toBe(false);
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

test('NodeLog', () => {
  const data = [123, 'test', { a: 5, b: [5, 6] }];
  const NodeA = new Node('Node-A');

  const mockFunc = jest.fn();

  NodeA.addEventListener('log', (e: VEvent) => {
    if (typeof e.detail === 'object' && e.detail !== null && hasOwnProperty(e.detail, 'args')) {
      mockFunc(e.detail.args);
    }
  });

  NodeA.log(...data);
  NodeA.log('test');
  expect(mockFunc).toBeCalledTimes(2);
  expect(mockFunc).toHaveBeenNthCalledWith(1, data);
  expect(mockFunc).toHaveBeenNthCalledWith(2, ['test']);
});

test('Async keepState works', (done) => {
  // Node A: one input
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  nodeA.action = function () {
    const p = new Promise<void>((resolve) => {
      setTimeout(() => {
        this.keepState();
        resolve();
      }, 0);
    });
    return p;
  };

  nodeA.addEventListener('afterResolve', function (this:Node) {
    expect(this.state).not.toBeNull();
    expect(this.hasState()).toBe(true);
    done();
  });
  nodeA.addEventListener('error', () => {
    throw new Error('Node had an error');
  });

  nodeA.resolve();
});
test('KeepState works', (done) => {
  // Node A: one input
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  nodeA.action = function () {
    this.keepState();
  };

  nodeA.addEventListener('afterResolve', function (this:Node) {
    expect(this.state).not.toBeNull();
    expect(this.hasState()).toBe(true);
    done();
  });
  nodeA.addEventListener('error', () => {
    throw new Error('Node had an error');
  });

  nodeA.resolve();
});

test('Multiple resolve test', (done) => {
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
  const outputB = nodeB.addOutput('one');
  nodeB.action = () => {
    if (!nodeB.inputIsNothing('one')) {
      const inputOne = nodeB.getInputValue('one') as number;
      const inputTwo = nodeB.getInputValue('two') as number;
      nodeB.setOutputValue('one', inputOne + inputTwo);
    }
  };
  inputB1.setDefaultValue(456);
  inputB2.setDefaultValue(2);
  inputB1.linkSocket(outputA1);

  const network = new Network();
  network.addNode(nodeA);
  network.addNode(nodeB);
  network.resolve().then(
    () => {
      expect(network.resolved).toBe(true);
      expect(outputB.getValue()).toBe(125);
      network.preResolve();
      network.resolve().then(
        () => {
          expect(network.resolved).toBe(true);
          expect(outputB.getValue()).toBe(125);
          done();
        },
      );
    },
  );
});

test('StorageMode', () => {
  const mockFn = jest.fn();

  const nodeA = new Node('Node-A');
  const network = new Network();
  network.addNode(nodeA);
  const inputA = nodeA.addInput('x');
  inputA.setDefaultValue(1);
  const outputA = nodeA.addOutput('y');
  nodeA.action = () => {
    if (!nodeA.inputIsNothing('x')) {
      const inputOne = nodeA.getInputValue('x') as number;
      nodeA.setOutputValue('y', inputOne + 1);
    } else {
      nodeA.setOutputValue('y', 1);
    }
  };

  const nodeB = new Node('Node-B');
  network.addNode(nodeB);
  const inputB = nodeB.addInput('x');
  const outputB = nodeB.addOutput('y', undefined, true);
  nodeB.action = () => {
    if (!nodeB.inputIsNothing('x')) {
      const inputOne = nodeB.getInputValue('x') as number;
      mockFn(inputOne);
      nodeB.setOutputValue('y', inputOne);
    }
  };
  inputB.linkSocket(outputA);
  inputA.linkSocket(outputB);
  for (let i = 0; i < 5; i++) {
    network.resolve();
  }
  expect(mockFn).toBeCalledTimes(5);
  for (let i = 1; i <= 5; i++) {
    expect(mockFn).toHaveBeenNthCalledWith(i, i);
  }
});
