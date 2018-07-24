import test from 'ava';
import deployContracts from '../src/backend/web3/index.mjs';
import getAccounts from "../src/backend/web3/get-accounts.mjs";

let contract;
let accounts;
test.beforeEach(async t => {
  const [eurekaContract] = await deployContracts();
  contract = eurekaContract;
  accounts = await getAccounts();
});

test('minting and total supply', async t => {
  let amounts = [];

  let amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  //initial Supply
  let initialTotalSupply = await getTotalSupply(accounts[0]);
  t.is(parseInt(initialTotalSupply), 0, 'should be 0');

  let gasEstimated = await contract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

  //Minting
 await contract.methods
   .mint(accounts, amounts)
   .send({
      from: accounts[0],
      gas: gasEstimated
    })
   .then((receipt) => {
     return receipt;
    });

  // total supply after minting
  const totalSupply = await getTotalSupply(accounts[0]);
  t.is(parseInt(totalSupply), amounts.length * amount, 'should be 1000 * 10');

  await contract.methods
    .finishMinting()
    .send({
      from: accounts[0]
    })
    .then((receipt) => {
      return receipt;
    });
});

test('minting and balanceOf', async t => {
  let amounts = [];

  let amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  // TODO check getBalanceOf before minting
  // let balance = await getBalanceOf(accounts[0]);
  // t.is(parseInt(balance), 0, 'should be 0');

  let gasEstimated = await contract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

  //Minting
  await contract.methods
    .mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .then((receipt) => {
      return receipt;
    });

  let balance = await getBalanceOf(accounts[0]);
  t.is(parseInt(balance), 1000, 'should be 1000');
});


test('minting and balanceOf of another address', async t => {
  let amounts = [];

  let amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  let gasEstimated = await contract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

  //Minting
  await contract.methods
    .mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .then((receipt) => {
      return receipt;
    });

  let balance = await getBalanceOf('0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88');
  t.is(parseInt(balance), 0, 'should be 0');
});




function getTotalSupply(account) {
  return contract.methods
    .totalSupply()
    .call({from: account})
    .then(succ => {
      return succ;
    });
}

function getBalanceOf(account) {
  return contract.methods
    .balanceOf(account)
    .call({from: account})
    .then((bal) => {
      return bal;
    })
    .catch(err => console.log(err));
}

