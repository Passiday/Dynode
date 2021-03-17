import Socket from './socket';

/**
 * Class that handles related socket management.
 *
 * @typeParam T  Class of sockets that will be managed.
 */
class SocketCollection<T extends Socket> {
  /**
   * A dictionary of sockets.
   */
  private socketsObject: {
    [key: string]: T,
  } = {};

  /**
   * Variable that keeps `socketsObject` ordered.
   *
   * It stores Socket's `accessName` properties.
   */
  private socketsOrder: string[] = [];

  /**
   * Register a socket to the collection.
   *
   * @param socket  Socket that will be added.
   */
  public addSocket(socket: T): void {
    if (socket.accessName === null) {
      throw Error('socket needs an accessName to be added!');
    }
    this.socketsObject[socket.accessName] = socket;
    this.socketsOrder.push(socket.accessName);
  }

  /**
   * Retrieve a socket from the collection, given its name.
   *
   * @param name  Socket's name in the collection.
   * @return  A socket that corresponds to `name`.
   */
  public getSocketByName(name: string): T {
    return this.socketsObject[name];
  }

  /**
   * Retrieve a socket from the collection, given its index.
   *
   * @param idx  Socket's index in the collection.
   * @return  A socket that corresponds to `idx`.
   */
  public getSocketByIndex(idx: number): T {
    return this.socketsObject[this.socketsOrder[idx]];
  }
}

export default SocketCollection;
