import StandardEngine from '../src/standardEngine';
import OutputSocket from '../src/outputSocket';

describe('getValueTypeDefinition', () => {
  test('Ensure number type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure boolean type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('boolean')).not.toThrow();
  });

  test('Ensure string type exists', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
  });

  test('Ensure unknown type throws', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('Object')).toThrow();
  });

  test('Ensure types are case sensitive', () => {
    const e = new StandardEngine();
    expect(() => e.getValueTypeDefinition('string')).not.toThrow();
    expect(() => e.getValueTypeDefinition('String')).toThrow();
  });
});
