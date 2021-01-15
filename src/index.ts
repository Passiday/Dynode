import Network from './network';
import LogNode from './nodetypes/logNode';
import ConstNode from './nodetypes/constNode';
import MathNode from './nodetypes/mathNode';

const n = new Network();

// Simple counter
const mathNode = n.addNode(new MathNode('+', 0, 1));
const constNode = n.addNode(new ConstNode(1));
const clogNode = n.addNode(new LogNode());
clogNode.setName('Counter');
n.addLink(constNode, mathNode, 0, 1);
n.addLink(mathNode, mathNode, 0, 0);
n.addLink(mathNode, clogNode, 0, 0);

// Pi calculator
const m1 = n.addNode(new MathNode('+', -1, 2));
const m2 = n.addNode(new MathNode('/', 4));
const m3 = n.addNode(new MathNode('*', 1, -1));
const m4 = n.addNode(new MathNode('*'));
const m5 = n.addNode(new MathNode('+', 0));
m5.setName('Pi');
m5.setLogging(true);
n.addLink(m1, m1, 0, 0);
n.addLink(m1, m2, 0, 1);
n.addLink(m2, m4, 0, 0);
n.addLink(m3, m4, 0, 1);
n.addLink(m3, m3, 0, 0);
n.addLink(m4, m5, 0, 1);
n.addLink(m5, m5, 0, 0);

/*
n.setPeriod(1000);
n.setRunning(true);
*/

declare global { function publishToGlobal(assets: Record<string, unknown>):void; }
global.publishToGlobal({
  demoNetwork: n,
});
