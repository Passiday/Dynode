import { Network, Node } from 'src/Dynode/model/core';

// import { VEventHandler, VEvent } from '../src/vanillaEvent';

// test('quadraticFormulaNetworkTest', () => {
//   // Network solves the quadratic equation
//   // Arcitecture:
//   // - Input parameters node: no inputs, three <number> outputs: a, b, c
//   // - c
//   function getMathNode(name: string) {
//     const node = new Node(name || 'Math');
//     node.addInput('operation');
//     node.addInput('x');
//     node.addInput('y');
//     node.addOutput('result');
//     node.action = function (this: Node) {
//       if (this.inputIsNothing('operation')) return;
//       const operation = this.getInputValue('operation');
//       if (operation === '+') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x') as number;
//         const y = this.getInputValue('y') as number;
//         this.setOutputValue('result', x + y);
//       }
//       if (operation === '-') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x') as number;
//         const y = this.getInputValue('y') as number;
//         this.setOutputValue('result', x - y);
//       }
//       if (operation === '*') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x') as number;
//         const y = this.getInputValue('y') as number;
//         this.setOutputValue('result', x * y);
//       }
//       if (operation === '/') {
//         // TODO protect from division by zero
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x') as number;
//         const y = this.getInputValue('y') as number;
//         this.setOutputValue('result', x / y);
//       }
//       if (operation === 'power') {
//         // TODO protect from (-1)**0.5
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x') as number;
//         const y = this.getInputValue('y') as number;
//         this.setOutputValue('result', x ** y);
//       }
//     };
//     return node;
//   }

//   const nodeParams = new Node('Params');
//   nodeParams.addInput('a').setDefaultValue(1);
//   nodeParams.addInput('b').setDefaultValue(-7);
//   nodeParams.addInput('c').setDefaultValue(12);
//   nodeParams.addOutput('a');
//   nodeParams.addOutput('b');
//   nodeParams.addOutput('c');
//   nodeParams.action = function (this: Node) {
//     if (this.inputIsNothing('a')) return;
//     if (this.inputIsNothing('b')) return;
//     if (this.inputIsNothing('c')) return;
//     this.setOutputValue('a', this.getInputValue('a'));
//     this.setOutputValue('b', this.getInputValue('b'));
//     this.setOutputValue('c', this.getInputValue('c'));
//   };

//   const nodeB2 = getMathNode('b**2');
//   const nodeAC = getMathNode('a*c');
//   const node4AC = getMathNode('4*a*c');
//   const nodeDis = getMathNode('Discriminant');
//   const nodeRoot = getMathNode('Root');
//   const nodeNegB = getMathNode('-b');
//   const node2A = getMathNode('2a');
//   const nodeBranch1 = getMathNode('Branch+');
//   const nodeBranch2 = getMathNode('Branch-');
//   const nodeRoot1 = getMathNode('Root1');
//   const nodeRoot2 = getMathNode('Root2');

//   nodeB2.getInput('operation').setDefaultValue('power');
//   nodeB2.linkInput('x', nodeParams.getOutput('b'));
//   nodeB2.getInput('y').setDefaultValue(2);

//   nodeAC.getInput('operation').setDefaultValue('*');
//   nodeAC.linkInput('x', nodeParams.getOutput('a'));
//   nodeAC.linkInput('y', nodeParams.getOutput('c'));

//   node4AC.getInput('operation').setDefaultValue('*');
//   node4AC.getInput('x').setDefaultValue(4);
//   node4AC.linkInput('y', nodeAC.getOutput('result'));

//   nodeDis.getInput('operation').setDefaultValue('-');
//   nodeDis.linkInput('x', nodeB2.getOutput('result'));
//   nodeDis.linkInput('y', node4AC.getOutput('result'));

//   nodeRoot.getInput('operation').setDefaultValue('power');
//   nodeRoot.linkInput('x', nodeDis.getOutput('result'));
//   nodeRoot.getInput('y').setDefaultValue(0.5);

//   nodeNegB.getInput('operation').setDefaultValue('*');
//   nodeNegB.linkInput('x', nodeParams.getOutput('b'));
//   nodeNegB.getInput('y').setDefaultValue(-1);

//   node2A.getInput('operation').setDefaultValue('*');
//   node2A.linkInput('x', nodeParams.getOutput('a'));
//   node2A.getInput('y').setDefaultValue(2);

//   nodeBranch1.getInput('operation').setDefaultValue('+');
//   nodeBranch1.linkInput('x', nodeNegB.getOutput('result'));
//   nodeBranch1.linkInput('y', nodeRoot.getOutput('result'));

//   nodeBranch2.getInput('operation').setDefaultValue('-');
//   nodeBranch2.linkInput('x', nodeNegB.getOutput('result'));
//   nodeBranch2.linkInput('y', nodeRoot.getOutput('result'));

//   nodeRoot1.getInput('operation').setDefaultValue('/');
//   nodeRoot1.linkInput('x', nodeBranch1.getOutput('result'));
//   nodeRoot1.linkInput('y', node2A.getOutput('result'));

//   nodeRoot2.getInput('operation').setDefaultValue('/');
//   nodeRoot2.linkInput('x', nodeBranch2.getOutput('result'));
//   nodeRoot2.linkInput('y', node2A.getOutput('result'));

//   const mockFunc = jest.fn(
//     function (this: OutputSocket) {
//       return this.getValue();
//     },
//   );

//   nodeRoot1.getOutput('result').addEventListener('value', mockFunc);
//   nodeRoot2.getOutput('result').addEventListener('value', mockFunc);

//   nodeRoot1.resolve();
//   nodeRoot2.resolve();

//   mockFunc.mockReturnValueOnce(4).mockReturnValueOnce(3);
// })

test('Async network', (done) => {
  const nodeA = new Node('Node-A');
  const inputA1 = nodeA.addInput('one');
  inputA1.setDefaultValue(123);
  const outputA1 = nodeA.addOutput('one');
  nodeA.action = () => {
    const p = new Promise<void>((pResolve) => {
      setTimeout(() => {
        if (!nodeA.inputIsNothing('one')) {
          const inputOne = nodeA.getInputValue('one');
          nodeA.setOutputValue('one', inputOne);
        }
        pResolve();
      }, 0);
    });
    return p;
  };

  // Node B: one input, no outputs
  const nodeB = new Node('Node-B');
  const inputB1 = nodeB.addInput('one');
  inputB1.linkSocket(outputA1);

  const network = new Network();
  network.addNode(nodeA);
  network.addNode(nodeB);

  // Expect promise resolving only when all nodes are resolved
  const p = network.resolve();
  p.then(() => {
    network.nodes.forEach((node) => expect(node.isResolved()).toBe(true));
    done();
  });
});

test('Network test', (done) => {
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

  // Node B: one input, no outputs
  const nodeB = new Node('Node-B');
  const inputB1 = nodeB.addInput('one');
  inputB1.linkSocket(outputA1);

  const network = new Network();
  network.addNode(nodeA);
  network.addNode(nodeB);
  // AfterResolve or promise can be used to check if the network has finished.
  network.addEventListener('afterResolve', function (this: Network) {
    this.nodes.forEach((node) => expect(node.isResolved()).toBe(true));
    done();
  });
  network.resolve();
});

test('Halting works', () => {
  const n = new Network();
  const errorCatcherFunc = jest.fn();
  n.addEventListener('error', errorCatcherFunc);

  n.resolve().then(() => {
    expect(errorCatcherFunc.mock.calls.length).toBe(0);
  }).then(() => {
    n.halt();
    n.resolve();
  }).then(() => {
    expect(errorCatcherFunc.mock.calls.length).toBe(1);
  });
});
