// import Node from '../src/node'
// import OutputSocket from '../src/outputSocket'
// import InputSocket from '../src/inputSocket'

// test('unlinkedNodeTest', () => {
//   const node = new Node('Node-A');
//   const input1 = node.addInput('one');
//   const input2 = node.addInput('two');
//   const output1 = node.addOutput('one');
//   input1.setDefaultValue(123);
//   input2.setDefaultValue();
//   output1.addEventListener('value', function (this: OutputSocket) {
//     if (this.isNothing()) {
//       console.log('Value is nothing.');
//     } else {
//       console.log('Value:', this.getValue());
//     }
//   });
//   node.resolve();
// });

// test('linkedNodesTest', () => {
//   // Node A: one input, one output
//   const nodeA = new Node('Node-A');
//   const inputA1 = nodeA.addInput('one');
//   inputA1.setDefaultValue(123);
//   nodeA.addOutput('one');
//   nodeA.action = () => {
//     if (!nodeA.inputIsNothing('one')) {
//       const inputOne = nodeA.getInputValue('one');
//       nodeA.setOutputValue('one', inputOne);
//     }
//   };
//   // Node B: two inputs, no outputs
//   const nodeB = new Node('Node-B');
//   const inputB1 = nodeB.addInput('one');
//   const inputB2 = nodeB.addInput('two');
//   inputB1.setDefaultValue(456);
//   inputB2.setDefaultValue();

//   // inputB1.linkSocket(outputA1);

//   nodeB.resolve();
// });
