import {
  Socket,
  InputSocket,
  OutputSocket,
} from 'src/Dynode/model/core/socket';

test('simpleSocketTest', () => {
  const socket = new Socket();
  const mockFun = jest.fn(function (this: Socket<unknown>) { return this; });
  socket.addEventListener('value', mockFun);

  socket.setValue(123);
  expect(mockFun.mock.results.slice(-1)[0].value.getValue()).toBe(123);

  expect(() => socket.setValue(456)).toThrow();

  socket.reset();
  socket.setNothing();
  expect(mockFun.mock.results.slice(-1)[0].value.isNothing()).toBe(true);
});

test('linkedInputSocketTest', () => {
  const outputSocket = new OutputSocket({} as any);
  const inputSocket = new InputSocket();
  const mockFun = jest.fn(function (this: Socket<unknown>) { return this; });

  expect(inputSocket.isSet()).toBe(false);

  inputSocket.setDefaultNothing();
  expect(inputSocket.isSet()).toBe(true);
  expect(inputSocket.isNothing()).toBe(true);

  inputSocket.setDefaultValue(999);
  expect(inputSocket.getValue()).toBe(999);

  inputSocket.linkSocket(outputSocket);
  inputSocket.addEventListener('value', mockFun);

  outputSocket.setValue(123);
  expect(mockFun.mock.results.slice(-1)[0].value.getValue()).toBe(123);

  inputSocket.reset();
  outputSocket.reset();
  expect(inputSocket.isSet()).toBe(false);

  inputSocket.clearLink();
  expect(inputSocket.isSet()).toBe(true);
  expect(inputSocket.getValue()).toBe(999);

  inputSocket.clearDefault();
  expect(inputSocket.isSet()).toBe(false);
});

test('outputSocketTest', () => {
  jest.useFakeTimers();

  const mockNode: any = {};
  const socket = new OutputSocket(mockNode);
  mockNode.resolve = jest.fn(
    () => setTimeout(() => socket.setValue(123), 1000),
  );

  // Post setValue test
  socket.addEventListener('value', () => {
    expect(socket.getValue).toBe(123);
    expect(socket.isWaiting()).toBe(false);
  });

  expect(socket.isWaiting()).toBe(false);
  socket.pull();
  expect(socket.isWaiting()).toBe(true);
});
