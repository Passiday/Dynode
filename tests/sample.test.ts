const SAMPLE: string = 'Constantly constant';

test('Expect a constant to not change', () => {
  expect(SAMPLE).toBe('Constantly constant');
});
