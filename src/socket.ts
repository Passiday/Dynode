class Socket {
  value: number|null;

  constructor() {
    this.value = null;
  }

  setValue(value: number|null): void {
    this.value = value;
  }

  getValue(): number|null {
    return this.value;
  }
}

export default Socket;
