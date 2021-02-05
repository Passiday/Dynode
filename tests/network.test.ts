// test('quadraticFormulaNetworkTest', () => {
//   // Network solves the quadratic equation
//   // Arcitecture:
//   // - Input parameters node: no inputs, three <number> outputs: a, b, c
//   // - c
//   function getMathNode(name) {
//     const node = new Node(name || 'Math');
//     node.addInput('operation');
//     node.addInput('x');
//     node.addInput('y');
//     node.addOutput('result');
//     node.action = () => {
//       if (this.inputIsNothing('operation')) return;
//       const operation = this.getInputValue('operation');
//       if (operation === '+') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x');
//         const y = this.getInputValue('y');
//         this.setOutputValue('result', x + y);
//       }
//       if (operation === '-') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x');
//         const y = this.getInputValue('y');
//         this.setOutputValue('result', x - y);
//       }
//       if (operation === '*') {
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x');
//         const y = this.getInputValue('y');
//         this.setOutputValue('result', x * y);
//       }
//       if (operation === '/') {
//         // TODO protect from division by zero
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x');
//         const y = this.getInputValue('y');
//         this.setOutputValue('result', x / y);
//       }
//       if (operation === 'power') {
//         // TODO protect from (-1)**0.5
//         if (this.inputIsNothing('x')) return;
//         if (this.inputIsNothing('y')) return;
//         const x = this.getInputValue('x');
//         const y = this.getInputValue('y');
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
//   nodeParams.action = () => {
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

//   const resultAnouncer = (e) => {
//     if (e.target.isNothing()) return;
//     console.log('And the result is 🥁🥁🥁', e.target.getValue(), '!!!');
//   };

//   nodeRoot1.getOutput('result').addEventListener('value', resultAnouncer);
//   nodeRoot2.getOutput('result').addEventListener('value', resultAnouncer);

//   nodeRoot1.resolve();
//   nodeRoot2.resolve();
// });