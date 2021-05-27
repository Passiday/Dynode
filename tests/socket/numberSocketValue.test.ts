import { Number } from 'src/Dynode/model/standard/valueDefinitions';

test('Positive number is serialized properly', () => {
  expect((new Number(42)).toJSON()).toStrictEqual({ normal: 42});
});

test('0 is serialized properly', () => {
  expect((new Number(0)).toJSON()).toStrictEqual({ normal: 0});
});

test('Negative number is serialized properly', () => {
  expect((new Number(-420)).toJSON()).toStrictEqual({ normal: -420 });
});

test('NaN is serialized properly', () => {
  expect((new Number(NaN).toJSON())).toStrictEqual({ special: 'NaN' });
});

test('Infinity is serialized properly', () => {
  expect((new Number(Infinity).toJSON())).toStrictEqual({ special: 'Infinity' });
});

test('-Infinity is serialized properly', () => {
  expect((new Number(-Infinity).toJSON())).toStrictEqual({ special: '-Infinity' });
});
