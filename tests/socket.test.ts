import { JsonValue } from 'src/utils/objectUtils';
import {
  Socket,
  InputSocket,
  OutputSocket,
  ValueType
} from 'src/Dynode/model/core/socket';

test('simpleSocketTest', () => {
  const socket = new Socket();
  const mockFun = jest.fn(function (this: Socket) { return this; });
  socket.addEventListener('value', mockFun);

  socket.setValue(123);
  expect(mockFun.mock.results.slice(-1)[0].value.getValue()).toBe(123);

  expect(() => socket.setValue(456)).toThrow();

  socket.reset();
  socket.setValue();
  expect(mockFun.mock.results.slice(-1)[0].value.isNothing()).toBe(true);
});

test('linkedInputSocketTest', () => {
  const outputSocket = new Socket();
  const inputSocket = new InputSocket();
  const mockFun = jest.fn(function (this: Socket) { return this; });

  expect(inputSocket.isSet()).toBe(false);

  inputSocket.setDefaultValue();
  expect(inputSocket.isSet()).toBe(true);
  expect(inputSocket.isNothing()).toBe(true);

  inputSocket.setDefaultValue(999);
  expect(inputSocket.getValue()).toBe(999);

  inputSocket.linkSocket(outputSocket as any);
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
    expect(socket.waiting).toBe(false);
  });

  expect(socket.waiting).toBe(false);
  socket.pull();
  expect(socket.waiting).toBe(true);
});

test('setValue with a type', () => {
  class VT extends ValueType {
    public check(value: unknown): boolean {
      return ((typeof value === 'number') && (value % 2 === 1));
    }

    public toJSON(value: unknown): JsonValue {
      return value as number
    }
  }
  const vt = new VT();
  const s = new Socket(vt);

  s.setValue(5);
  expect(s.getValue()).toBe(5);
  expect(() => s.setValue(10)).toThrow();
});

test('getJsonDefaultValue', () => {
  class VT extends ValueType {
    public check(value: unknown): boolean {
      return (typeof value === 'number')
    }

    public toJSON(value: unknown): JsonValue {
      return value as number
    }
  }
  const vt = new VT();
  const s = new InputSocket(vt);

  s.setDefaultValue(5);
  expect(s.isDefaultSet()).toBe(true);
  expect(s.getJsonDefaultValue()).toBe(5);
});
