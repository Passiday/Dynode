import ValueType from './valueType';

export default [
  new ValueType('number', (value: unknown) => typeof value === 'number'),
  new ValueType('boolean', (value: unknown) => typeof value === 'boolean'),
  new ValueType('string', (value: unknown) => typeof value === 'string'),
];
