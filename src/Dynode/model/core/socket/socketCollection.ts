import Socket from './socket';

/**
 * Class that handles related socket management.
 *
 * @typeParam T  Class of sockets that will be managed.
 */
class SocketCollection<T extends Socket<unknown>> {
  /**
   * Main storage for sockets.
   */
  private sockets: T[] = [];

  /**
   * Register a socket to the collection.
   *
   * @param socket  Socket that will be added.
   */
  public addSocket(socket: T): void {
    if (socket.name === null) {
      throw Error('socket needs a name to be added!');
    }

    for (const existingSocket of this.sockets) {
      if (existingSocket.name === socket.name) {
        throw Error(`Collection already has a socket with name ${socket.name} !`);
      }
    }

    this.sockets.push(socket);
  }

  /**
   * Retrieve a socket from the collection, given its name.
   *
   * @param name  Socket's name in the collection.
   * @return  A socket that corresponds to `name`.
   */
  public getSocketByName(name: string): T {
    for (const socket of this.sockets) {
      if (socket.name === name) return socket;
    }

    throw new Error(`${name} does not exist in this collection!`);
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
    if (idx >= this.sockets.length || idx < 0) {
      throw new Error('Index out of bounds!');
    }
    return (this.sockets)[idx];
  }

  /**
   * Clear all sockets in the collection.
   */
  public clear(): void {
    for (const socket of this.sockets) {
      socket.clear();
    }
  }

  /**
   * Reset all sockets in the collection
   */
  public reset(): void {
    for (const socket of this.sockets) {
      socket.reset();
    }
  }

  /**
   * Retrieve all sockets in order.
   *
   * @return  Ordered socket array.
   */
  public getAllSockets(): T[] {
    return [...this.sockets];
  }

  /**
   * Generator, that retrieves sockets
   */
  * [Symbol.iterator](): Generator<T, void, unknown> {
    for (const socket of this.sockets) {
      yield socket;
    }
  }
}

export default SocketCollection;
