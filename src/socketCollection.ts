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
    if (!this.socketsOrder.includes(name)) {
      throw new Error(`${name} does not exist in this collection!`);
    }
    return this.socketsObject[name];
  }

  /**
   * Retrieve a socket from the collection, given its index.
   *
   * @param idx  Socket's index in the collection.
   * @return  A socket that corresponds to `idx`.
   */
  public getSocketByIndex(idx: number): T {
    if (idx % 1 !== 0) {
      throw new Error('Index must be an integer!');
    }
    if (idx >= this.socketsOrder.length || idx < 0) {
      throw new Error('Index out of bounds!');
    }
    return this.socketsObject[this.socketsOrder[idx]];
  }

  public getAllSockets(): T[] {
    const arr: T[] = [];
    this.socketsOrder.forEach(
      (name) => arr.push(this.getSocketByName(name)),
    );
    return arr;
  }
}

export default SocketCollection;
