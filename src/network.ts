import Link from './link';
import Node from './node';

class Network {
  period: number; // Time (in ms) between each update

  running: boolean;

  links: Link[];

  nodes: Node[];

  name: string; // Name is (currently) used to discern different networks in console logs

  constructor(name = 'network') {
    this.period = 0; // Set default clock speed to maximum
    this.running = false;
    this.links = [];
    this.nodes = [];
    this.name = name;
  }

  addNode(node: Node): Node {
    this.nodes.push(node);
    return this.nodes[this.nodes.length - 1];
  }

  addLink(headNode: Node, tailNode: Node, outputN: number, inputN: number): Link {
    this.links.push(new Link(headNode, tailNode, outputN, inputN));
    return this.links[this.links.length - 1];
  }

  setPeriod(period: number): void {
    this.period = period;
  }

  setRunning(running: boolean): void {
    if (running) {
      this.running = true;

      // Executes the run function after {this.period} milliseconds
      setTimeout(() => {
        this.run();
      }, this.period);
    } else {
      this.running = false;
    }
  }

  run(): void {
    if (this.running) {
      this.tick();
      // If network is still running, executes the run function after {this.period} milliseconds
      setTimeout(() => {
        this.run();
      }, this.period);
    }
  }

  // One update cycle
  tick(): void {
    console.log(`--- ${this.name} ---`);
    this.nodes.forEach((node) => node.update());
    this.links.forEach((link) => link.update());
  }
}

export default Network;
