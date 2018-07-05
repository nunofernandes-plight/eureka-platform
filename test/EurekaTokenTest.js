import test from 'ava';
import deployContracts from '../src/backend/web3/index.mjs';
import getAccounts from "../src/backend/web3/get-accounts.mjs";

test('minting', async t => {
  const [eurekaContract] = await deployContracts();

  let accounts = await getAccounts();
  let amounts = [];

  accounts.forEach(() => {
    amounts.push(1000);
  });

  await getTotalSupply(accounts[0], eurekaContract);

  let gasEstimated = await eurekaContract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

 await eurekaContract.methods
   .mint(accounts, amounts)
   .send({
      from: accounts[0],
      gas: gasEstimated
    })
   .on('receipt', async receipt => {
     console.log(receipt);
     return receipt;
    });

  const totalSupply = await getTotalSupply(accounts[0], eurekaContract);

  t.is(totalSupply, (amounts.length * 1000).toString());
});

function getTotalSupply(account, eurekaContract) {
  return eurekaContract.methods
    .totalSupply()
    .call({from: account})
    .then(succ => {
      console.log(succ);
      return succ;
    });
}

function getBalanceOf(account, eurekaContract) {
  return eurekaContract.methods
    .balanceOf(account)
    .call({from: account})
    .then((bal) => {
      console.log(bal);
      return bal;
    })
    .catch(err => console.log(err));
}

