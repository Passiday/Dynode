import { Number as NumberSocketValue } from 'src/Dynode/model/standard/valueDefinitions';

test('Positive number is serialized properly', () => {
  expect((new NumberSocketValue(42)).toJSON()).toStrictEqual({ normal: 42 });
});

test('0 is serialized properly', () => {
  expect((new NumberSocketValue(0)).toJSON()).toStrictEqual({ normal: 0 });
});

test('Negative number is serialized properly', () => {
  expect((new NumberSocketValue(-420)).toJSON()).toStrictEqual({ normal: -420 });
});

test('NaN is serialized properly', () => {
  expect((new NumberSocketValue(NaN).toJSON())).toStrictEqual({ special: 'NaN' });
});

test('Infinity is serialized properly', () => {
  expect((new NumberSocketValue(Infinity).toJSON())).toStrictEqual({ special: 'Infinity' });
});

test('-Infinity is serialized properly', () => {
  expect((new NumberSocketValue(-Infinity).toJSON())).toStrictEqual({ special: '-Infinity' });
});
