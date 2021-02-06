import Socket from './socket';
import type Node from './node';

class OutputSocket extends Socket {
  waiting = false;

  parent: Node;

  constructor(parentNode: Node) {
    super();
    this.parent = parentNode;
  }

  pull(): void {
    if (this.waiting) return;
    this.waiting = true;
    this.parent.resolve();
  }

  init(): void {
    super.init();
    this.waiting = false;
  }

  setValue(value?: unknown): void {
    this.waiting = false;
    if (arguments.length) {
      super.setValue(value);
    } else {
      super.setValue();
    }
  }
}

export default OutputSocket;
