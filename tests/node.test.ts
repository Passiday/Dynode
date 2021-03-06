import { Network, Node } from 'src/Dynode/model/core';
import { OutputSocket } from 'src/Dynode/model/core/socket';
import { VEvent } from 'src/utils/vanillaEvent';
import { hasOwnProperty } from 'src/utils/objectUtils';

test('unlinkedNodeTest', () => {
  const node = new Node('Node-A');
  const input1 = node.addInput('one');
  const input2 = node.addInput('two');
  const output1 = node.addOutput('one');
  input1.setDefaultValue(123);
  input2.setDefaultNothing();
  output1.addEventListener('value', function (this: OutputSocket<unknown>) {
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
  inputB2.setDefaultNothing();

  nodeB.resolve();
  expect(inputB1.getValue()).toBe(456);

  inputB1.linkSocket(outputA1);
  nodeB.reset();
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
  nodeB.reset();
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

  NodeA.addEventListener('log', (e: VEvent<Node>) => {
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

test('StorageMode', (done) => {
  const mockFn = jest.fn();

  const network = new Network();

  // nodeIncrement: one input x, one output y. Outputs 1, if x is nothing, else x + 1.
  const nodeIncrement = new Node('Increment');
  network.addNode(nodeIncrement);
  const inputIncrement = nodeIncrement.addInput('x');
  inputIncrement.setDefaultValue(1); // Default is used when the linked output's state is nothing.
  const outputIncrement = nodeIncrement.addOutput('y');
  nodeIncrement.action = () => {
    if (!nodeIncrement.inputIsNothing('x')) {
      const inputOne = nodeIncrement.getInputValue('x') as number;
      nodeIncrement.setOutputValue('y', inputOne + 1);
    } else {
      nodeIncrement.setOutputValue('y', 1);
    }
  };

  // nodeB one input x, one storage-mode output y. Pass the value of x to the output y.
  const nodeStore = new Node('Store');
  network.addNode(nodeStore);
  const inputStore = nodeStore.addInput('x');
  const outputStore = nodeStore.addOutput('y', undefined, true);
  nodeStore.action = () => {
    if (!nodeStore.inputIsNothing('x')) {
      const inputOne = nodeStore.getInputValue('x') as number;
      mockFn(inputOne);
      nodeStore.setOutputValue('y', inputOne);
    }
  };

  inputStore.linkSocket(outputIncrement);
  inputIncrement.linkSocket(outputStore);

  // Resolve (asynchronously!) the network 5 times
  let step = 0;
  const networkResolve = (): void => {
    if (step < 5) {
      network.resolve().then(networkResolve);
      step++;
    } else {
      expect(mockFn).toBeCalledTimes(5);
      for (let i = 1; i <= 5; i++) {
        expect(mockFn).toHaveBeenNthCalledWith(i, i);
      }
      done();
    }
  };
  networkResolve();
});
