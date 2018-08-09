import test from 'ava';
import deployContracts from '../../../../src/backend/web3/index.mjs';
import getAccounts from '../../../../src/backend/web3/get-accounts.mjs';
import {
  finishMinting,
  getBalanceOf,
  getTotalSupplyOf,
  mintEurekaTokens
} from '../../../../src/backend/web3/web3-token-contract-methods.mjs';

let EurekaPlatformContract = undefined;
let EurekaTokenContract = undefined;
let contractOwner = undefined;
let accounts = [];

const setup = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts();
  contractOwner = accounts[0];
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;

  let tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(20000);
  });
  await mintEurekaTokens(
    EurekaTokenContract,
    accounts,
    tokenAmounts,
    contractOwner
  );
  await finishMinting(EurekaTokenContract, contractOwner);
};

test.beforeEach(async () => {
  let [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;
  accounts = await getAccounts();
});

test('minting and total supply', async t => {
  let amounts = [];

  let amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  //initial Supply
  let initialTotalSupply = await getTotalSupplyOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(initialTotalSupply), 0, 'should be 0');

  //Minting
  await mintEurekaTokens(
    EurekaTokenContract,
    accounts,
    amounts,
    contractOwner
  );

  // total supply after minting
  let totalSupply = await getTotalSupplyOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(totalSupply), 1000 * 10, 'should be 1000 * 10');

  //Minting
  await mintEurekaTokens(
    EurekaTokenContract,
    accounts,
    amounts,
    contractOwner
  );

  // total supply after second minting
  totalSupply = await getTotalSupplyOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(totalSupply), 1000 * 20, 'should be 1000 * 20');

  await finishMinting(EurekaTokenContract, contractOwner);

  //TODO test finish Minting -> minting should not be possible anymore

});

test('minting and balanceOf', async t => {
  let amounts = [];

  let amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  // balance before minting
  let balance = await getBalanceOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(balance), 0, 'should be 0');

  //Minting
  await mintEurekaTokens(
    EurekaTokenContract,
    accounts,
    amounts,
    contractOwner
  );

  let newbalance = await getBalanceOf(EurekaTokenContract, accounts[1]);
  t.is(parseInt(newbalance), 1000, 'should be 1000');
});


test('minting and balanceOf of another address', async t => {
  let changedAccounts = accounts;
  changedAccounts.splice(9);

  let amounts = [];
  let amount = 1000;
  changedAccounts.forEach(() => {
    amounts.push(amount);
  });

  //Minting
  await mintEurekaTokens(
    EurekaTokenContract,
    changedAccounts,
    amounts,
    contractOwner
  );

  let balance = await getBalanceOf(EurekaTokenContract, accounts[9]);
  t.is(parseInt(balance), 0, 'should be 0');
});

