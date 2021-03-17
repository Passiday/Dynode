import InputSocket from '../src/inputSocket';
import SocketCollection from '../src/socketCollection';

describe('getSocketByIndex', () => {
  test('properly index socket collection with 1 input', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.accessName = 'something';
    sc.addSocket(i1);

    expect(sc.getSocketByIndex(0)).toBe(i1);
  });

  test('properly index socket collection with multiple inputs', () => {
    const sc = new SocketCollection();
    const inputs: InputSocket[] = [];
    for (let i = 0; i < 3; i++) {
      const socket = new InputSocket();
      socket.accessName = `s${i}`;
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
    i1.accessName = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(1)).toThrow();
  });

  test('given negative index to throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.accessName = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(-1)).toThrow();
  });

  test('given float index to throw', () => {
    const sc = new SocketCollection();
    const i1 = new InputSocket();
    i1.accessName = 'something';
    sc.addSocket(i1);

    expect(() => sc.getSocketByIndex(0.3)).toThrow();
  });
});

test('Test access by name', () => {
  const sc = new SocketCollection();
  const i1 = new InputSocket();
  i1.accessName = 'someInput';
  sc.addSocket(i1);

  expect(sc.getSocketByName('someInput')).toBe(i1);
});
