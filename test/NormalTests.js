import test from "ava";

test('foo', t => {
  t.pass();
});

test('arrays are equal', t => {
  t.deepEqual([1, 2], [1, 2]);
});


test('bar', async t => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});