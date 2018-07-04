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

  let accounts = await getAccounts();
  let amounts = [];

  accounts.forEach(() => {
    amounts.push(1000);
  });

  eurekaContract.methods.totalSupply().call({
    from: accounts[0]
  })
    .then(()=>(console.log));

  let gasEstimated = await eurekaContract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });
  console.log(gasEstimated);
  // console.log(eurekaContract);

  const receipt = await eurekaContract.methods.mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .on('receipt', async receipt => {
      // console.log(receipt);
      // TODO: check balances and assert it.



      //TODO map and promise all
      let amountAfterMinting = await getBalanceOf(accounts[0], eurekaContract);
      console.log(amountAfterMinting);
      return receipt;
    });

  t.pass();

});

function getBalanceOf(account, eurekaContract) {
  return eurekaContract.methods.balanceOf(account)
    .call({
      from: account
    }).then((bal) => {
      console.log(bal);
      return bal;
    }).catch(err => console.log(err));
}

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

