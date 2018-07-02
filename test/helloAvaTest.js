import test from 'ava';
import eurekaContract from '../src/backend/web3/index.mjs';
// import isProduction from '../src/helpers/isProduction.mjs'

test('arrays are equal', t => {
  t.deepEqual([1, 2], [1, 2]);
});

test('foo', t => {
  t.pass();
});

// test('bar', async t => {
//   const bar = Promise.resolve('bar');
//
//   t.is(await bar, 'bar');
// });

// test('eureka', async t => {
//   const contract = eurekaContract;
//   t.is(contract, contract)
// });