import Link from './link'
import Node from './node'

class Network {
  period: number;
  running: boolean;
  links: Link[];
  nodes: Node[];
  name: string;
  constructor(name: string = "network") {
    this.period = 0;
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
    if(running == true) {
      this.running = true;
      let me = this;
      setTimeout(function() {
        me.run();
      }, me.period);
    } else {
      this.running = false;
    }
  }

  update() {
    console.log(`--- ${this.name} ---`)
    // I have absolutely no clue why I should use (... as any), but if I don't, it does not work :(
    this.nodes.forEach(node => (node as any).update())
    this.links.forEach(link => (link as any).update())
  }

  render() {
    this.nodes.forEach(node => (node as any).render())
    this.links.forEach(link => (link as any).render())
  }

  run() {
    if(this.running) {
      this.tick();
      let me = this;
      setTimeout(function() {
        me.run();
      }, me.period);
    }
  }
  
  tick() {
    this.update();
    this.render();
  }
}
  
export default Network