import InputSocket from './inputSocket';
import OututSocket from './outputSocket';

class Node {
  busy = false;

  resolve(): void {
    if (this.busy) return;
    this.busy = true;
  }
}

export default Node;
