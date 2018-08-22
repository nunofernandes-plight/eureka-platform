import {signUpEditor} from '../../src/backend/web3/web3-platform-contract-methods.mjs';
import {
  mintEurekaTokens,
  finishMinting,
  submitArticle,
  getBalanceOf
} from '../../src/backend/web3/web3-token-contract-methods.mjs';
import test from 'ava';
import app from '../../src/backend/api/api.mjs';
import deployContracts from '../../src/backend/web3/index.mjs';
import getAccounts from '../../src/backend/web3/get-accounts.mjs';
import User from '../../src/backend/schema/user.mjs';
import ArticleSubmission from '../../src/backend/schema/article-submission.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import articleVersionService from '../../src/backend/db/article-version-service.mjs';
import getArticleHex from '../../src/backend/web3/get-articleHex.mjs';
import {
  getLinkedArticles,
  assignForSubmissionProcess,
  removeEditorFromSubmissionProcess,
  changeEditorFromSubmissionProcess,
  setSanityToOk,
  setSanityIsNotOk,
  inviteReviewersForArticle,
  acceptReviewerInvitation
} from '../../src/backend/web3/web3-platform-contract-methods.mjs';
import {sleepSync} from '../helpers.js';
import {getAuthors} from '../../src/backend/web3/web3-platform-contract-methods.mjs';
import web3 from 'web3';
import ArticleVersion from '../../src/backend/schema/article-version.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;

const PRETEXT = 'INTEGRATION: ';
const ARTICLE1 = {
  articleHash: '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'article1.url',
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
const ARTICLE1_DATA_IN_HEX = getArticleHex(ARTICLE1);
const ARTICLE1_HASH_HEX = '0x' + ARTICLE1.articleHash;


const ARTICLE2 = {
  articleHash: '551aa99a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'article2.url',
  authors: [
    '0x8a19ee7f2f65da61e288455d33baeea283b9ea97',
    '0xc81c582875967d6d134ebe513c2a79b4490f6ecb'
  ],
  contributorRatios: [2000, 8000],
  linkedArticles: [
    '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
    '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
    'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
  ],
  linkedArticlesSplitRatios: [2000, 2000, 6000]
};
const ARTICLE2_DATA_IN_HEX = getArticleHex(ARTICLE2);
const ARTICLE2_HASH_HEX = '0x' + ARTICLE2.articleHash;

/**************** TESTING ****************/

test.beforeEach(async () => {
  let [eurekaContract, platformContract] = await deployContracts();
  await setupContract(eurekaContract, platformContract);
  contractOwner = accounts[0];

  app.setupApp(eurekaPlatformContract);
  app.listenTo(process.env.PORT || 8080);
  await cleanDB();
});

test.afterEach(async () => {
  app.close();
  await cleanDB();
});

test.after(() => {
});

async function setupContract(eurekaContract, platformContract) {
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
  await ArticleVersion.remove({});
}

test(PRETEXT + 'Sign up Editor', async t => {
  await userService.createUser('test', 'test@test.test', contractOwner, 'test-avatar');

  let user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, false);

  await signUpEditor(eurekaPlatformContract, contractOwner, contractOwner);

  user = await userService.getUserByEthereumAddress(contractOwner);
  t.is(user.isEditor, true);
});


test(PRETEXT + 'Submit an Article &  auto change of Status from DRAFT --> SUBMITTED', async t => {
  // create user on DB
  t.is((await userService.getAllUsers()).length, 0);
  let user = await userService.createUser('test', 'test@test.test', contractOwner, 'test-avatar');
  t.is((await userService.getAllUsers()).length, 1);

  // create an article-draft on DB
  t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
  await articleSubmissionService.createSubmission(user.ethereumAddress);
  let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];

  t.is(articleSubmission.articleVersions.length, 1);
  let articleVersion = articleSubmission.articleVersions[0];
  t.is(articleVersion.articleVersionState, ArticleVersionState.DRAFT);

  // send articleHash to DB
  await articleVersionService.finishDraftById(user.ethereumAddress, articleVersion._id, ARTICLE1_HASH_HEX);
  articleVersion = await articleVersionService.getArticleVersionById(user.ethereumAddress, articleVersion._id);
  t.is(articleVersion.articleVersionState, ArticleVersionState.FINISHED_DRAFT);
  t.is(articleVersion.articleHash, ARTICLE1_HASH_HEX);

  // submission on the SC
  await submitArticle(eurekaTokenContract, user.ethereumAddress, eurekaPlatformContract.options.address, 5000, ARTICLE1_DATA_IN_HEX);
  articleVersion = await articleVersionService.getArticleVersionById(user.ethereumAddress, articleVersion._id);
  t.is(articleVersion.articleVersionState, ArticleVersionState.SUBMITTED);
});


test.only(PRETEXT + 'Assignment, Change and Remove of Editor for Submission Process', async t => {
  // create author and editor
  let testAccounts = await getAccounts();
  let author = await userService.createUser('testAuthor', 'author@test.test', contractOwner, 'test-author-avatar');
  let editor = await userService.createUser('testEditor', 'editor@test.test', testAccounts[2], 'test-editor-avatar');
  let editor2 = await userService.createUser('testEditor2', 'editor2@test.test', testAccounts[3], 'test-editor2-avatar');
  t.is(true, true);

  // signup editor and submit article
  await signUpEditor(eurekaPlatformContract, editor.ethereumAddress, contractOwner);

  // setup article draft
  await articleSubmissionService.createSubmission(author.ethereumAddress);
  let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
  let articleVersion = articleSubmission.articleVersions[0];
  await articleVersionService.finishDraftById(author.ethereumAddress, articleVersion._id, ARTICLE1_HASH_HEX);

  // submit articleHash on SC
  await submitArticle(eurekaTokenContract, author.ethereumAddress, eurekaPlatformContract.options.address, 5000, ARTICLE1_DATA_IN_HEX);
  articleVersion = await articleVersionService.getArticleVersionById(author.ethereumAddress, articleVersion._id);
  articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmission._id);

  let counter = 0;
  while (
    typeof articleSubmission.scSubmissionID === 'undefined' &&
      counter < 5){
    sleepSync(5000);
    articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmission._id);
    counter++;
  }
  await assignForSubmissionProcess(eurekaPlatformContract, articleSubmission.scSubmissionID, editor.ethereumAddress);
  articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmission._id);
  t.is(articleSubmission.editor, editor.ethereumAddress);

  // await submitArticle(
  //   eurekaTokenContract,
  //   author.ethereumAddress,
  //   eurekaPlatformContract.options.address,
  //   5000,
  //   ARTICLE1_DATA_IN_HEX
  // );
  //
  // let articleSubmissions = await articleSubmissionService.getAllSubmissions();
  // t.is(articleSubmissions.length, 1);
  //
  //
  // // assign editor from the submission process
  // await assignForSubmissionProcess(eurekaPlatformContract, articleSubmissions[0]._id, editor.ethereumAddress);
  // let articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
  // t.is(articleSubmission.editor, editor.ethereumAddress);
  //
  // // change editor from the submission process
  // await signUpEditor(eurekaPlatformContract, editor2.ethereumAddress, contractOwner);
  // await changeEditorFromSubmissionProcess(eurekaPlatformContract, articleSubmissions[0]._id, editor2.ethereumAddress);
  // articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
  // t.is(articleSubmission.editor, editor2.ethereumAddress);
  //
  // // remove editor from the submission process
  // await removeEditorFromSubmissionProcess(eurekaPlatformContract, articleSubmission._id, editor2.ethereumAddress);
  // articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
  // t.is(articleSubmission.editor, undefined);
});
//
// test(PRETEXT + 'Submission of article, Sanity-Check', async t => {
//   // create author and editor
//   let testAccounts = await getAccounts();
//   let author = await userService.createUser('testAuthor', 'author@test.test', contractOwner, 'test-author-avatar');
//   let editor = await userService.createUser('testEditor', 'editor@test.test', testAccounts[4], 'test-editor-avatar');
//
//   // signup editor and submit article 1 & 2
//   await signUpEditor(eurekaPlatformContract, editor.ethereumAddress, contractOwner);
//   await submitArticle(
//     eurekaTokenContract,
//     author.ethereumAddress,
//     eurekaPlatformContract.options.address,
//     5000,
//     ARTICLE1_DATA_IN_HEX
//   );
//   await submitArticle(
//     eurekaTokenContract,
//     author.ethereumAddress,
//     eurekaPlatformContract.options.address,
//     5000,
//     ARTICLE2_DATA_IN_HEX
//   );
//
//   let articleSubmissions = await articleSubmissionService.getAllSubmissions();
//   t.is(articleSubmissions.length, 2);
//
//   //TODO try sanity check without being assign first --> expected behavior: must fail
//
//   // assign editor for the submission process of article 1 & 2
//   await assignForSubmissionProcess(eurekaPlatformContract, articleSubmissions[0]._id, editor.ethereumAddress);
//   let articleSubmission1 = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//   t.is(articleSubmission1.editor, editor.ethereumAddress);
//
//   await assignForSubmissionProcess(eurekaPlatformContract, articleSubmissions[1]._id, editor.ethereumAddress);
//   let articleSubmission2 = await articleSubmissionService.getSubmissionById(articleSubmissions[1]._id);
//   t.is(articleSubmission2.editor, editor.ethereumAddress);
//
//   //Accept sanity check for article 1
//   t.is(articleSubmission1.articleVersions[0].articleVersionState, ArticleVersionState.SUBMITTED);
//   const articleHash1 = articleSubmission1.articleVersions[0].articleHash;
//   await setSanityToOk(eurekaPlatformContract, articleHash1, editor.ethereumAddress);
//   articleSubmission1 = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//   t.is(articleSubmission1.articleVersions[0].articleVersionState, ArticleVersionState.EDITOR_CHECKED);
//
//   // Decline sanity check for article 2
//   t.is(articleSubmission2.articleVersions[0].articleVersionState, ArticleVersionState.SUBMITTED);
//   const articleHash2 = articleSubmission2.articleVersions[0].articleHash;
//   await setSanityIsNotOk(eurekaPlatformContract, articleHash2, editor.ethereumAddress);
//   articleSubmission2 = await articleSubmissionService.getSubmissionById(articleSubmissions[1]._id);
//   t.is(articleSubmission2.articleVersions[0].articleVersionState, ArticleVersionState.DECLINED_SANITY_NOTOK);
// });

// test(PRETEXT + 'Invite reviewers for review article & Reviewers accept Invitation ', async t => {
//   // create author and editor
//   let testAccounts = await getAccounts();
//   let author = await userService.createUser('testAuthor', 'author@test.test', contractOwner, 'test-author-avatar');
//   let editor = await userService.createUser('testEditor', 'editor@test.test', testAccounts[4], 'test-editor-avatar');
//
//   let reviewer1 = await userService.createUser('testReviewer1', 'reviewer1@test.test', testAccounts[5], 'test-reviewer-avatar');
//   let reviewer2 = await userService.createUser('testReviewer2', 'reviewer2@test.test', testAccounts[6], 'test-reviewer-avatar');
//
//   /** Sign-up and submission **/
//   // signup editor and submit article 1
//   await signUpEditor(eurekaPlatformContract, editor.ethereumAddress, contractOwner);
//   await submitArticle(
//     eurekaTokenContract,
//     author.ethereumAddress,
//     eurekaPlatformContract.options.address,
//     5000,
//     ARTICLE1_DATA_IN_HEX
//   );
//
//   let articleSubmissions = await articleSubmissionService.getAllSubmissions();
//   t.is(articleSubmissions.length, 1);
//
//   // assign editor for the submission process of article 1 & 2
//   await assignForSubmissionProcess(eurekaPlatformContract, articleSubmissions[0]._id, editor.ethereumAddress);
//   let articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//   t.is(articleSubmission.editor, editor.ethereumAddress);
//
//   // Accept sanity check for article 1
//   const articleHash = articleSubmission.articleVersions[0].articleHash;
//   await setSanityToOk(eurekaPlatformContract, articleHash, editor.ethereumAddress);
//
//   /** Invite Rerviewers **/
//   // Status befor Invitation
//   articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//   t.is(articleSubmission.articleVersions[0].articleVersionState, ArticleVersionState.EDITOR_CHECKED);
//   t.is(articleSubmission.articleVersions[0].reviews.length, 0);
//
//   await inviteReviewersForArticle(eurekaPlatformContract, articleHash,
//     [reviewer1.ethereumAddress, reviewer2.ethereumAddress], editor.ethereumAddress);
//
//   // Status after invitation
//   articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//   let dbReviewer1 = await userService.getUserByEthereumAddress(reviewer1.ethereumAddress);
//   let dbReviewer2 = await userService.getUserByEthereumAddress(reviewer2.ethereumAddress);
//   t.is(articleSubmission.articleVersions[0].articleVersionState, ArticleVersionState.REVIEWERS_INVITED);
//   let counter = 0;
//   //try 5 times to call DB as it can take some time to write all into DB
//   while (
//     (articleSubmission.articleVersions[0].reviews.length < 2 ||
//       dbReviewer1.reviewerInvitation.length < 1 ||
//       dbReviewer2.reviewerInvitation.length < 1)
//     &&
//     counter < 5) {
//     sleepSync(5000);
//     articleSubmission = await articleSubmissionService.getSubmissionById(articleSubmissions[0]._id);
//     dbReviewer1 = await userService.getUserByEthereumAddress(reviewer1.ethereumAddress);
//     dbReviewer2 = await userService.getUserByEthereumAddress(reviewer2.ethereumAddress);
//     console.log('Looper for the ' + (counter + 1) + ' time');
//     counter++;
//   }
//   t.is(articleSubmission.articleVersions[0].reviews.length, 2);
//   t.is(dbReviewer1.reviewerInvitation.length, 1);
//   t.is(dbReviewer2.reviewerInvitation.length, 1);
//
//   /** Acception of Invitation **/
//   await acceptReviewerInvitation(eurekaPlatformContract, articleHash, reviewer1.ethereumAddress);
// });

