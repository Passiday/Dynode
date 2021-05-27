import { InputSocket, SocketCollection } from 'src/Dynode/model/core/socket';

describe('addSocket', () => {
  test('given socket with no name, throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();

    expect(() => sc.addSocket(i1)).toThrow();
  });

  test('given sockets with same name, throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'duplicate';
    sc.addSocket(i1);

    const i2 = new InputSocket();
    i2.name = 'duplicate';

    expect(() => sc.addSocket(i2)).toThrow();
  });
});

describe('getSocketByName', () => {
  test('properly obtain item in 1 item collection', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'someInput';
    sc.addSocket(i1);

    expect(sc.getSocketByName('someInput')).toBe(i1);
  });

  test('given non-existent name, throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'someInput';
    sc.addSocket(i1);

    expect(() => sc.getSocketByName('wrong')).toThrow();
  });
});

describe('getSocketByIndex', () => {
  test('properly index socket collection with 1 input', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'something';
    sc.addSocket(i1);

    expect(sc.getSocketByIndex(0)).toBe(i1);
  });

  test('properly index socket collection with multiple inputs', () => {
    const sc = new SocketCollection();
    const inputs: InputSocket<unknown>[] = [];
    for (let i = 0; i < 3; i++) {
      const socket = new InputSocket();
      socket.name = `s${i}`;
      inputs.push(socket);
      sc.addSocket(socket);
    }

    for (let i = 0; i < 3; i++) {
      expect(sc.getSocketByIndex(i)).toBe(inputs[i]);
    }
  });

  test('called on empty collection to throw', () => {
    const sc = new SocketCollection();
    expect(() => sc.getSocketByIndex(0)).toThrow();
  });

  test('given out-of-bounds index to throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(1)).toThrow();
  });

  test('given negative index to throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(-1)).toThrow();
  });

  test('given float index to throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.name = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(0.3)).toThrow();
  });
});

describe('getAllSockets', () => {
  test('given empty collection, return empty array', () => {
    const sc = new SocketCollection();

    expect(sc.getAllSockets()).toEqual([]);
  });

  test('given some sockets, ensure correctly ordered array', () => {
    const sc = new SocketCollection();
    const expected: InputSocket<unknown>[] = [];
    for (let i = 0; i < 5; i++) {
      const socket = new InputSocket();
      socket.name = `i${i}`;
      expected.push(socket);
      sc.addSocket(socket);
    }

    expect(sc.getAllSockets()).toEqual(expected);
  });

  test('returned array is not a reference to an internal', () => {
    const sc = new SocketCollection();
    const expected: InputSocket<unknown>[] = [];
    for (const i of [1, 2, 3]) {
      const socket = new InputSocket();
      socket.name = `i${i}`;
      sc.addSocket(socket);
      expected.push(socket);
    }

    const values = sc.getAllSockets();
    values.splice(2, 1);
    expect(sc.getAllSockets()).toEqual(expected);
  });
});

test('changed node name should be reflected in SocketCollection', () => {
  const sc = new SocketCollection();
  const s1 = new InputSocket();
  s1.name = 'old';
  sc.addSocket(s1);

  expect(sc.getSocketByName('old')).toBe(s1);

  s1.name = 'new';
  expect(() => sc.getSocketByName('old')).toThrow();
  expect(sc.getSocketByName('new')).toBe(s1);
});

test('SocketCollection iterator', () => {
  const sc = new SocketCollection();
  const s1 = new InputSocket();
  s1.name = 's1';
  const s2 = new InputSocket();
  s2.name = 's2';
  sc.addSocket(s1);
  sc.addSocket(s2);

  const mockFn = jest.fn();

  for (const socket of sc) {
    mockFn(socket);
  }
  expect(mockFn).toBeCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith(s1);
  expect(mockFn).toHaveBeenLastCalledWith(s2);
});
