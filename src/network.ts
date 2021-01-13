import Link from './link';
import Node from './node';

class Network {
  period: number; // Time (in ms) between each update

  running: boolean;

  links: Link[];

  nodes: Node[];

  name: string; // Name is (currently) used to discern different networks in console logs

  constructor(name: string = 'network') {
    this.period = 0; // Set default clock speed to maximum
    this.running = false;
    this.links = [];
    this.nodes = [];
    this.name = name;
  }

  addNode(node: Node) {
    this.nodes.push(node);
    return this.nodes[this.nodes.length - 1];
  }

  addLink(headNode: Node, tailNode: Node, outputN: number, inputN: number) {
    this.links.push(new Link(headNode, tailNode, outputN, inputN));
    return this.links[this.links.length - 1];
  }

  setPeriod(period: number) {
    this.period = period;
  }

  setRunning(running: boolean) {
    if (running == true) {
      this.running = true;

      // Executes the run function after {this.period} milliseconds
      const me = this;
      setTimeout(() => {
        me.run();
      }, me.period);
    } else {
      this.running = false;
    }
  }

  run() {
    if (this.running) {
      this.tick();
      // If network is still running, executes the run function after {this.period} milliseconds
      const me = this;
      setTimeout(() => {
        me.run();
      }, me.period);
    }
  }

  // One update cycle
  tick() {
    console.log(`--- ${this.name} ---`);
    // I have absolutely no clue why I should use (... as any), but if I don't, it does not work :(
    this.nodes.forEach((node) => (node as any).update());
    this.links.forEach((link) => (link as any).update());
  }
}

export default Network;
