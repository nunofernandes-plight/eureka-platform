import test from 'ava';
import deployContracts from '../src/backend/web3/index.mjs';
import getAccounts from "../src/backend/web3/get-accounts.mjs";
// import isProduction from '../src/helpers/isProduction.mjs'

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

test('minting', async t => {
  const [eurekaContract] = await deployContracts();
  console.log(eurekaContract);

  let accounts = await getAccounts();
  let amounts = [];

  accounts.forEach(() => {
    amounts.push(1000);
  });

  let gasEstimated = await eurekaContract.methods.mint(accounts, amounts).

  eurekaContract.methods.mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .on('receipt', receipt => {
      console.log(receipt);
      // TODO: check balances and assert it.
    });

  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});

// eb3Contract
//   .deploy({data: bytecode})
//   .send({
//     from: accounts[0],
//     gas: gasEstimated
//   })
//   .on('receipt', receipt => {
//     console.log(
//       'Smart contract "' +
//       contractName +
//       '" has been deployed and accepted in block number ' +
//       receipt.blockNumber +
//       ' (address: ' +
//       receipt.contractAddress +
//       ')'
//     );
//   });

