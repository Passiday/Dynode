import Socket from './socket';

class SocketCollection {
  /**
   * A dictionary of sockets.
   */
  private socketsObject: {
    [key: string]: Socket,
  } = {};

  /**
   * Variable that keeps `socketsObject` ordered.
   *
   * It stores Socket's `accessName` properties.
   */
  private socketsOrder: string[] = [];

  public addSocket(socket: Socket): void {
    if (socket.accessName === null) {
      throw Error('socket needs an accessName to be added!');
    }
    this.socketsObject[socket.accessName] = socket;
    this.socketsOrder.push(socket.accessName);
  }

  public getSocketByName(name: string): Socket {
    return this.socketsObject[name];
  }

  public getSocketByIndex(idx: number): Socket {
    return this.socketsObject[this.socketsOrder[idx]];
  }
}

export default SocketCollection;
