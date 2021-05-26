import { SocketValue } from 'src/Dynode/model';

describe('Base SocketValue to accept only JSONifiable values', () => {
  test('String is accepted', () => {
    expect(() => new SocketValue('example')).not.toThrow();
  });

  test('Number is accepted', () => {
    expect(() => new SocketValue(42)).not.toThrow();
  });

  test('Boolean is accepted', () => {
    expect(() => new SocketValue(true)).not.toThrow();
  });

  test('null is accepted', () => {
    expect(() => new SocketValue(null)).not.toThrow();
  });

  test('undefined is refused', () => {
    expect(() => new SocketValue(undefined)).toThrow();
  });

  test('Symbol is refused', () => {
    expect(() => new SocketValue(Symbol('example'))).toThrow();
  });

  test('Function is refused', () => {
    expect(() => new SocketValue(() => 'foo')).toThrow();
  });

  describe('Objects', () => {
    test('Simple object with accepted values is accepted', () => {
      expect(() => new SocketValue({ a: 4, b: false, c: 'example'})).not.toThrow();
    });

    test('Nested object with accepted values is accepted', () => {
      expect(() => new SocketValue({
        c: 20, item: { aKey: true, bKey: null }, d: 'foo'
      })).not.toThrow();
    });

    test('Simple object with only unaccepted values is refused', () => {
      expect(() => new SocketValue({ key: undefined, apple: () => 'apple' })).toThrow();
    });

    test('Simple object with some unaccepted values is refused', () => {
      expect(() => new SocketValue({
        d: 83, e: true, c: undefined, f: 'string',
      })).toThrow();
    });

    test('Nested object with some unaccepted values is refused', () => {
      expect(() => new SocketValue({
        l: false, iHaveRunOutOfIdeasForKeyNames: { a: 'foo', c: undefined },
      })).toThrow();
    });
  });
});
