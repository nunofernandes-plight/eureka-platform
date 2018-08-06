import {signUpEditor} from '../src/backend/web3/web3-platform-contract-methods.mjs';
import {
  mintEurekaTokens,
  finishMinting,
  submitArticle,
  getBalanceOf
} from '../src/backend/web3/web3-token-contract-methods.mjs';
import test from 'ava';
import app from '../src/backend/api/api.mjs';
import deployContracts from '../src/backend/web3/index.mjs';
import getAccounts from '../src/backend/web3/get-accounts.mjs';
import User from '../src/backend/schema/user.mjs';
import ArticleSubmission from '../src/backend/schema/article-submission.mjs';
import userService from '../src/backend/db/user-service.mjs';
import getArticleHex from '../src/backend/web3/get-articleHex.mjs';
import {getLinkedArticles} from '../src/backend/web3/web3-platform-contract-methods.mjs';
import {getAuthors} from '../src/backend/web3/web3-platform-contract-methods.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;

const PRETEXT = 'INTEGRATION: ';

test.before(async () => {
  let [eurekaContract, platformContract] = await deployContracts();
  await setupContract(eurekaContract, platformContract);

  app.setupApp(eurekaPlatformContract);
  app.listenTo(process.env.PORT || 8080);

  contractOwner = accounts[0];

  await cleanDB();
});

test.after( () => {
  app.close();
})

async function setupContract  (eurekaContract, platformContract){
  accounts = await getAccounts();
  contractOwner = accounts[0];
  eurekaTokenContract = eurekaContract;
  eurekaPlatformContract = platformContract;

  let tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(20000);
  });
  await mintEurekaTokens(
    eurekaTokenContract,
    accounts,
    tokenAmounts,
    contractOwner
  );
  await finishMinting(eurekaTokenContract, contractOwner);
}

async function cleanDB() {
  await User.remove({});
  await ArticleSubmission.remove({});
}

test( PRETEXT + 'Event - DB -> Sign up Editor', async t => {
  await userService.createUser('test', 'test@test.test', contractOwner);

  let user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, false);

  await signUpEditor(eurekaPlatformContract, contractOwner, contractOwner);

  user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, true);
});

test(PRETEXT + 'Event - DB ->  Submit Article', async t => {
  let article = {
    articleHash: '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
    url: 'hoihoi',
    authors: [
      '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88',
      '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'
    ],
    contributorRatios: [4000,6000],
    linkedArticles: [
      '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
      '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
      'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
    ],
    linkedArticlesSplitRatios: [3334,3333,3333]
  };
  let dataInHex = getArticleHex(article);
  let articleHashHex = '0x' + article.articleHash;

  await submitArticle(
    eurekaTokenContract,
    contractOwner,
    eurekaPlatformContract.options.address,
    5000,
    dataInHex
  );

  let balance = await getBalanceOf(eurekaTokenContract, eurekaPlatformContract.options.address);
  t.is('5000', balance);
  t.is(3, (await getLinkedArticles(eurekaPlatformContract, articleHashHex, contractOwner)).length);
  t.is(2, (await getAuthors(eurekaPlatformContract, articleHashHex, contractOwner)).length);
});