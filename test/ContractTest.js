//
// import isProduction from '../../src/helpers/isProduction';
// import dotenv from 'dotenv';
// import deployContracts from '../../src/backend/web3/index';
// import app from '../../src/backend/api/api';
// import contractMethodTester from './contract-method-tester';
// import User from '../../src/backend/schema/user';
// import Submission from '../../src/backend/schema/submission';
// import userService from '../../src/backend/db/user-service';
// import getAccounts from '../../src/backend/web3/get-accounts';
// import {finishMinting, mintEurekaTokens} from '../../src/backend/web3/web3-token-contract-methods';
// import {signUpEditor} from '../../src/backend/web3/web3-platform-contract-methods';
//
// // const {dotenv} = require('dotenv');
// // const {deployContracts} = require('../../src/backend/web3/index');
// // const {app} = require('../../src/backend/api/api');
// // const {User} = require('../../src/backend/schema/user');
// // const {Submission} = require('../../src/backend/schema/submission');
// // const {userService} = require('../../src/backend/db/user-service');
// // const {getAccounts} = require('../../src/backend/web3/get-accounts');
// // const {finishMinting, mintEurekaTokens} = require('../../src/backend/web3/web3-token-contract-methods');
// // const {signUpEditor} = require('../../src/backend/web3/web3-platform-contract-methods');
//
// let EurekaPlatformContract = undefined;
// let EurekaTokenContract = undefined;
// let contractOwner = undefined;
//
// describe('sample test', function() {
//   it(' should give 5, when sum up 2 + 3', function() {
//     assert.ok(2 + 3 === 5);
//   });
// });
//
// describe('Integration Test: SC - Backend', () => {
//   before('connect', (done) => {
//     if (!isProduction()) {
//       dotenv.config();
//
//       return deployContracts()
//         .then(async ([eurekaTokenContract, eurekaPlatformContract]) => {
//           //start backend
//           app.setupApp(eurekaPlatformContract);
//           app.listenTo(process.env.PORT || 8080);
//
//           const accounts = await getAccounts();
//           contractOwner = accounts[0];
//           EurekaPlatformContract = eurekaPlatformContract;
//           EurekaTokenContract = eurekaTokenContract;
//
//           let tokenAmounts = [];
//           accounts.forEach(() => {
//             tokenAmounts.push(20000);
//           });
//           await mintEurekaTokens(
//             EurekaTokenContract,
//             accounts,
//             tokenAmounts,
//             contractOwner
//           );
//           await finishMinting(EurekaTokenContract, contractOwner);
//         });
//     }
//   });
//
//   beforeEach(() => {
//     cleanDB();
//
//   });
//
//   it('should  sign up up an user as editor in SC and DB', (done) => {
//     let user = createUserOnDB();
//     signUpEditor(EurekaPlatformContract, contractOwner, contractOwner);
//
//     console.log(user);
//
//     assert(2 + 3 === 5);
//     done();
//   });
// });
//
// async function cleanDB() {
//   await User.remove({});
//   await Submission.remove({});
// }
// async function createUserOnDB() {
//   let user = await userService.createUser('test2', 'test', 'test@test.test', contractOwner);
//   return user;
// }

import {signUpEditor} from '../src/backend/web3/web3-platform-contract-methods.mjs';
import test from 'ava';
import app from '../src/backend/api/api.mjs';
import deployContracts from '../src/backend/web3/index.mjs';
import getAccounts from '../src/backend/web3/get-accounts.mjs';
import User from '../src/backend/schema/user.mjs';
import Submission from '../src/backend/schema/submission.mjs';
import userService from '../src/backend/db/user-service.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;


test.beforeEach(async t => {
  const [eurekaContract, platformContract] = await deployContracts();
  eurekaTokenContract = eurekaContract;
  eurekaPlatformContract = platformContract;
  accounts = await getAccounts();

  app.setupApp(eurekaPlatformContract);
  app.listenTo(process.env.PORT || 8081);

  contractOwner = accounts[0];

  await cleanDB();
});

async function cleanDB() {
  await User.remove({});
  await Submission.remove({});
}

test('Event - DB -> Sign up Editor', async t => {
  await userService.createUser('test2', 'test', 'test@test.test', contractOwner);

  let user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, false);

  await signUpEditor(eurekaPlatformContract, contractOwner, contractOwner);

  user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, true);
  app.close();
});

test('foo', t => {
  t.pass();
  app.close();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
  app.close();
});