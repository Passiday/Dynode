import StandardEngine from '../src/standardEngine';
import OutputSocket from '../src/outputSocket';
import ValueType from '../src/valueType';

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

describe('addValueTypeDefinition', () => {
  test('A valueType can be added', () => {
    const e = new StandardEngine();
    const v = new ValueType(
      'even',
      (val: unknown) => typeof(val) === 'number' && val % 2 == 0
    );
    expect(() => e.addValueTypeDefinition(v)).not.toThrow();
  });

  test('Ensure duplicate names throw', () => {
    const e = new StandardEngine();
    const v1 = new ValueType(
      'even',
      (val: unknown) => typeof(val) === 'number' && val % 2 == 0
    );
    const v2 = new ValueType(
      'even',
      (val: unknown) => typeof(val) === 'number' && val % 2 == 0
    );

    expect(() => e.addValueTypeDefinition(v1)).not.toThrow();
    expect(() => e.addValueTypeDefinition(v2)).toThrow();
  });
});
