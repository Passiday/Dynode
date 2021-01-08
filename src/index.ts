import Dynode from './dynode';
import Network from './network';
import LogNode from './nodetypes/logNode'
import ConstNode from './nodetypes/constNode'
import MathNode from './nodetypes/mathNode';

let d = new Dynode();
let n = new Network();

// Simple counter
let mathNode = n.addNode(new MathNode("+", 0, 1));
let constNode = n.addNode(new ConstNode(1));
let clogNode = n.addNode(new LogNode());
clogNode.setName("Counter");
n.addLink(constNode, mathNode, 0, 1);
n.addLink(mathNode, mathNode, 0, 0);
n.addLink(mathNode, clogNode, 0, 0);

// Pi calculator
let m1 = n.addNode(new MathNode("+", -1, 2));
let m2 = n.addNode(new MathNode("/", 4));
let m3 = n.addNode(new MathNode("*", 1, -1));
let m4 = n.addNode(new MathNode("*"));
let m5 = n.addNode(new MathNode("+", 0));
m5.setName("Pi")
m5.setLogging(true);
n.addLink(m1, m1, 0, 0);
n.addLink(m1, m2, 0, 1);
n.addLink(m2, m4, 0, 0);
n.addLink(m3, m4, 0, 1);
n.addLink(m3, m3, 0, 0);
n.addLink(m4, m5, 0, 1);
n.addLink(m5, m5, 0, 0);

n.setPeriod(1000);
n.setRunning(true);