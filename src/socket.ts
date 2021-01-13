import Node from './node';

class Socket {
  value: any;

  constructor() {
    this.value = null;
  }

  setValue(value: any) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

export default Socket;
