const SimpleStorage = require('../app/SimpleStorage');

const testKey = 'test';
const testData = {hello: 'world!'};
const testData2 = {foo: 'bar'};

test('create item', done => {
  expect(SimpleStorage.has(testKey)).toBeFalsy();
  expect(SimpleStorage.get(testKey)).toBeNull();
  SimpleStorage.set(testKey, testData, () => {
    expect(SimpleStorage.has(testKey)).toBeTruthy();
    done();
  });
});

test('read item', () => {
  expect(SimpleStorage.has(testKey)).toBeTruthy();
  expect(SimpleStorage.get(testKey)).toEqual(testData);
});

test('rewrite item', () => {
  expect(SimpleStorage.has(testKey)).toBeTruthy();
  SimpleStorage.set(testKey, testData2, null, true);
  expect(SimpleStorage.get(testKey)).toEqual(testData2);
});

test('remove item', () => {
  expect(SimpleStorage.has(testKey)).toBeTruthy();
  SimpleStorage.remove(testKey, () =>
    expect(SimpleStorage.has(testKey)).toBeFalsy());
});
