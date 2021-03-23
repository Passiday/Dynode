import ValueType from './valueType';

export default [
  ValueType('number', (value: unknown) => typeof value === 'number'),
  ValueType('boolean', (value: unknown) => typeof value === 'boolean'),
  // And rest of them
];
