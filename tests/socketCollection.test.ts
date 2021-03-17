import InputSocket from '../src/inputSocket';
import SocketCollection from '../src/socketCollection';

test('Test index access', () => {
  const sc = new SocketCollection();
  const i1 = new InputSocket();
  i1.accessName = 'something';
  sc.addSocket(i1);

  expect(sc.getSocketByIndex(0)).toBe(i1);
});

test('Test access by name', () => {
  const sc = new SocketCollection();
  const i1 = new InputSocket();
  i1.accessName = 'someInput';
  sc.addSocket(i1);

  expect(sc.getSocketByName('someInput')).toBe(i1);
});
