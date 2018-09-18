import test from 'ava';
import deployContracts from '../../../../src/backend/web3/index.mjs';
import getAccounts from '../../../../src/backend/web3/get-accounts.mjs';
import {
  finishMinting,
  getBalanceOf,
  getTotalSupplyOf,
  mintEurekaTokens
} from '../../../../src/smartcontracts/methods/web3-token-contract-methods.mjs';
import web3 from '../../../../src/backend/web3/web3Instance.mjs';

let EurekaPlatformContract;
let EurekaTokenContract;
let contractOwner;
let accounts = [];

const setup = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts(web3);
  contractOwner = accounts[0];
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;

  const tokenAmounts = [];
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
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;
  accounts = await getAccounts(web3);
});

test('minting and total supply', async t => {
  const amounts = [];

  const amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  // Initial Supply
  const initialTotalSupply = await getTotalSupplyOf(
    EurekaTokenContract,
    accounts[0]
  );
  t.is(parseInt(initialTotalSupply), 0, 'should be 0');

  // Minting
  await mintEurekaTokens(EurekaTokenContract, accounts, amounts, contractOwner);

  // Total supply after minting
  let totalSupply = await getTotalSupplyOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(totalSupply), 1000 * 10, 'should be 1000 * 10');

  // Minting
  await mintEurekaTokens(EurekaTokenContract, accounts, amounts, contractOwner);

  // Total supply after second minting
  totalSupply = await getTotalSupplyOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(totalSupply), 1000 * 20, 'should be 1000 * 20');

  await finishMinting(EurekaTokenContract, contractOwner);

  // TODO test finish Minting -> minting should not be possible anymore
});

test('minting and balanceOf', async t => {
  const amounts = [];

  const amount = 1000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  // Balance before minting
  const balance = await getBalanceOf(EurekaTokenContract, accounts[0]);
  t.is(parseInt(balance), 0, 'should be 0');

  // Minting
  await mintEurekaTokens(EurekaTokenContract, accounts, amounts, contractOwner);

  const newbalance = await getBalanceOf(EurekaTokenContract, accounts[1]);
  t.is(parseInt(newbalance), 1000, 'should be 1000');
});

test('minting and balanceOf of another address', async t => {
  const changedAccounts = accounts;
  changedAccounts.splice(9);

  const amounts = [];
  const amount = 1000;
  changedAccounts.forEach(() => {
    amounts.push(amount);
  });

  // Minting
  await mintEurekaTokens(
    EurekaTokenContract,
    changedAccounts,
    amounts,
    contractOwner
  );

  const balance = await getBalanceOf(EurekaTokenContract, accounts[9]);
  t.is(parseInt(balance), 0, 'should be 0');
});
