import Dynode from './dynode';
import Network from './network';
import Node from './node';
import ClogNode from './nodetypes/clogNode'
import ConstNode from './nodetypes/constNode'
import ElarithNode from './nodetypes/elarithNode';
import DefNode from './nodetypes/defNode';

let d = new Dynode();
let n = new Network();

// Simple counter
let elarithNode = n.addNode(new ElarithNode("+", 0, 1));
let constNode = n.addNode(new ConstNode(1));
let clogNode = n.addNode(new ClogNode());
clogNode.setName("Counter");
n.addLink(constNode, elarithNode, 0, 1);
n.addLink(elarithNode, elarithNode, 0, 0);
n.addLink(elarithNode, clogNode, 0, 0);

// Pi calculator
let e1 = n.addNode(new ElarithNode("+", -1, 2));
let e2 = n.addNode(new ElarithNode("/", 4));
let e3 = n.addNode(new ElarithNode("*", 1, -1));
let e4 = n.addNode(new ElarithNode("*"));
let e5 = n.addNode(new ElarithNode("+", 0));
e5.setName("Pi")
e5.setLogging(true);
n.addLink(e1, e1, 0, 0);
n.addLink(e1, e2, 0, 1);
n.addLink(e2, e4, 0, 0);
n.addLink(e3, e4, 0, 1);
n.addLink(e3, e3, 0, 0);
n.addLink(e4, e5, 0, 1);
n.addLink(e5, e5, 0, 0);

n.setPeriod(1000);
n.setRunning(true);