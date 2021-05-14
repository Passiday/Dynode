import ValueType from './valueType';

export default [
  new ValueType('number', (value: unknown) => typeof value === 'number', (value: unknown) => <number> value),
  new ValueType('boolean', (value: unknown) => typeof value === 'boolean', (value: unknown) => <boolean> value),
  new ValueType('string', (value: unknown) => typeof value === 'string', (value: unknown) => <string> value),
];
