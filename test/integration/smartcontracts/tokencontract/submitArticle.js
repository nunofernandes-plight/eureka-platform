import test from 'ava';
import web3 from '../../../../src/backend/web3/web3Instance.mjs';
import deployContracts from '../../../../src/backend/web3/index.mjs';
import getAccounts from '../../../../src/backend/web3/get-accounts.mjs';
import {
  finishMinting,
  getBalanceOf,
  mintEurekaTokens,
  submitArticle
} from '../../../../src/backend/web3/web3-token-contract-methods.mjs';
import getArticleHex from '../../../../src/backend/web3/get-articleHex.mjs';
import {
  getAuthors,
  getLinkedArticles,
  getSubmissionProcess,
  getUrl
} from '../../../../src/backend/web3/web3-platform-contract-methods.mjs';

let EurekaPlatformContract;
let EurekaTokenContract;
let contractOwner;
let accounts = [];

const setup = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts();
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
  await setup(EurekaTokenContract, EurekaPlatformContract);
});

const article = {
  articleHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'hoihoi',
  authors: [
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88',
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'
  ],
  contributorRatios: [4000, 6000],
  linkedArticles: [
    '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
    '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
    'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
  ],
  linkedArticlesSplitRatios: [3334, 3333, 3333]
};

const dataInHex = getArticleHex(web3, article);
const articleHashHex = '0x' + article.articleHash;

test('submit article', async t => {
  // Service contract balance before submitting article
  let balance = await getBalanceOf(
    EurekaTokenContract,
    EurekaPlatformContract.options.address
  );
  t.is(parseInt(balance), 0, 'should be 0');

  // Balance of sender
  let senderBalance = await getBalanceOf(EurekaTokenContract, accounts[1]);
  t.is(parseInt(senderBalance), 20000, 'should be 20000');

  await submitArticle(
    EurekaTokenContract,
    accounts[1],
    EurekaPlatformContract.options.address,
    5000,
    dataInHex
  );

  balance = await getBalanceOf(
    EurekaTokenContract,
    EurekaPlatformContract.options.address
  );
  t.is(parseInt(balance), 5000, 'should be 5000');

  senderBalance = await getBalanceOf(EurekaTokenContract, accounts[1]);
  t.is(parseInt(senderBalance), 15000, 'should be 15000');

  const authors = await getAuthors(
    EurekaPlatformContract,
    articleHashHex,
    accounts[1]
  );
  t.deepEqual(
    web3.utils.toChecksumAddress(authors[1]),
    web3.utils.toChecksumAddress(article.authors[1]),
    'should be ' + web3.utils.toChecksumAddress(article.authors[1])
  );

  const linkedArticles = await getLinkedArticles(
    EurekaPlatformContract,
    articleHashHex,
    accounts[1]
  );
  t.deepEqual(
    linkedArticles[2].substring(2),
    article.linkedArticles[2],
    'should be ' + article.linkedArticles[2]
  );

  const url = await getUrl(
    web3,
    EurekaPlatformContract,
    articleHashHex,
    accounts[1]
  );
  t.deepEqual(url, article.url, 'should be ' + article.url);

  const submissionProcess = await getSubmissionProcess(
    EurekaPlatformContract,
    articleHashHex,
    accounts[1]
  );
  t.deepEqual(
    web3.utils.toChecksumAddress(submissionProcess.submissionOwner),
    web3.utils.toChecksumAddress(accounts[1]),
    'should be ' + web3.utils.toChecksumAddress(accounts[1])
  );
});
