import Engine from '../src/engine';
import OutputSocket from '../src/outputSocket';

describe('getValueTypeDefinition', () => {
  test('Ensure number type exists', () => {
    const e = new Engine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure boolean type exists', () => {
    const e = new Engine();
    expect(() => e.getValueTypeDefinition('boolean')).not.toThrow();
  });

  test('Ensure string type exists', () => {
    const e = new Engine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure unknown type throws', () => {
    const e = new Engine();
    expect(() => e.getValueTypeDefinition('Object')).toThrow();
  });

  test('Ensure types are case sensitive', () => {
    const e = new Engine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
    expect(() => e.getValueTypeDefinition('String')).toThrow();
  });
});
