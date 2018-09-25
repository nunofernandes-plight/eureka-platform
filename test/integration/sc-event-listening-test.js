import {signUpEditor} from '../../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import {submitArticle} from '../../src/smartcontracts/methods/web3-token-contract-methods.mjs';
import test from 'ava';
import app from '../../src/backend/api/api.mjs';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';
import ScTransactionType from '../../src/backend/schema/sc-transaction-state-enum.mjs';
import ReviewState from '../../src/backend/schema/review-state-enum.mjs';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import articleVersionService from '../../src/backend/db/article-version-service.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import {cleanDB} from '../helpers.js';
import getArticleHex from '../../src/smartcontracts/methods/get-articleHex.mjs';
import {
  assignForSubmissionProcess,
  removeEditorFromSubmissionProcess,
  changeEditorFromSubmissionProcess,
  setSanityToOk,
  setSanityIsNotOk,
  inviteReviewersForArticle,
  acceptReviewInvitation,
  addEditorApprovedReview,
  addCommunityReview,
  acceptReview,
  declineReview
} from '../../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import {sleepSync} from '../helpers.js';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import web3 from '../../src/helpers/web3Instance.mjs';

import dotenv from 'dotenv';
import {
  platformContract,
  setupWeb3Interface,
  tokenContract
} from '../../src/backend/web3/web3InterfaceSetup.mjs';
import {deploy} from '../../src/smartcontracts/deployment/deployer-and-mint.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;

const PRETEXT = 'INTEGRATION: ';
const ARTICLE1 = {
  articleHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
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
const ARTICLE1_DATA_IN_HEX = getArticleHex(web3, ARTICLE1);
const ARTICLE1_HASH_HEX = '0x' + ARTICLE1.articleHash;

const ARTICLE2 = {
  articleHash:
    '551aa99a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
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
const ARTICLE2_DATA_IN_HEX = getArticleHex(web3, ARTICLE2);
const ARTICLE2_HASH_HEX = '0x' + ARTICLE2.articleHash;

const REVIEW1 = {
  reviewHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7', // TODO change?
  reviewText: 'This is the test-text for the review or reviewer 1',
  score1: 3,
  score2: 5,
  articleHasMajorIssues: true,
  articleHasMinorIssues: true
};
const REVIEW1_HASH_HEX = '0x' + REVIEW1.reviewHash;

const REVIEW1_CORRECTED = {
  reviewHash:
    '999aa57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'Corrected version of review2',
  score1: 3,
  score2: 3,
  articleHasMajorIssues: false,
  articleHasMinorIssues: false
};
const REVIEW1_CORRECTED_HASH_HEX = '0x' + REVIEW1_CORRECTED.reviewHash;

const REVIEW2 = {
  reviewHash:
    '000ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7', // TODO change?
  reviewText: 'That one is the second review. So it comes from reviewer2',
  score1: 1,
  score2: 1,
  articleHasMajorIssues: true,
  articleHasMinorIssues: true
};
const REVIEW2_HASH_HEX = '0x' + REVIEW2.reviewHash;

const REVIEW3 = {
  reviewHash:
    '333cc57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7', // TODO change?
  reviewText: 'Third review. So it comes from reviewer3',
  score1: 4,
  score2: 4,
  articleHasMajorIssues: true,
  articleHasMinorIssues: false
};
const REVIEW3_HASH_HEX = '0x' + REVIEW3.reviewHash;

/** ************** TESTING ****************/

// test.beforeEach(async () => {
//   const [eurekaContract, platformContract] = await deployContracts();
//   await setupContract(eurekaContract, platformContract);
//   contractOwner = accounts[0];
//
//   app.setupApp(eurekaPlatformContract);
//   app.listenTo(process.env.PORT || 8080);
//   await cleanDB();
// });
//
// test.afterEach(async () => {
//   await app.close();
//   await cleanDB();
// });

test.before(async () => {
  accounts = await getAccounts(web3);
  contractOwner = accounts[0];

  await dotenv.config();
  app.setupApp();
  app.listenTo(process.env.PORT || 8080);
});
test.beforeEach(async () => {
  await cleanDB();
  await deploy();
  await setupWeb3Interface();
  eurekaPlatformContract = platformContract;
  eurekaTokenContract = tokenContract;
});
test.after(() => {
  app.close();
});

// Wurde vorher benötigt
// async function setupContract(eurekaContract, platformContract) {
//   accounts = await getAccounts(web3);
//   contractOwner = accounts[0];
//   eurekaTokenContract = eurekaContract;
//   eurekaPlatformContract = platformContract;
//
//   const tokenAmounts = [];
//   accounts.forEach(() => {
//     tokenAmounts.push(20000);
//   });
//   await mintEurekaTokens(
//     eurekaTokenContract,
//     accounts,
//     tokenAmounts,
//     contractOwner
//   );
//   await finishMinting(eurekaTokenContract, contractOwner);
// }

/************************ Sign up Editor ************************/

test(PRETEXT + 'Sign up Editor', async t => {
  await userService.createUser(
    'test',
    'test@test.test',
    contractOwner,
    'test-avatar'
  );

  let user = await userService.getUserByEthereumAddress(contractOwner);
  // t.is(user.isEditor, false);
  t.is(user.roles.length, 1);
  t.is(user.roles[0], Roles.CONTRACT_OWNER);

  await signUpEditor(eurekaPlatformContract, contractOwner, contractOwner);

  user = await userService.getUserByEthereumAddressWithScTransactions(
    contractOwner
  );

  let counter = 0;
  while (user.scTransactions.length < 1 && counter < 5) {
    sleepSync(5000);
    user = await userService.getUserByEthereumAddressWithScTransactions(
      contractOwner
    );
    counter++;
  }

  t.is(user.roles.length, 2); // [REVIEWER, AUTHOR, CONTRACT-OWNER, EDITOR]
  t.is(user.roles[1], Roles.EDITOR);
  t.is(user.scTransactions.length, 1);
  t.is(
    user.scTransactions[0].transactionType,
    ScTransactionType.EDITOR_ASSIGNED
  );
});

/************************ Submit an Article &  auto change of Status from DRAFT --> SUBMITTED ************************/

test(
  PRETEXT +
    'Submit an Article &  auto change of Status from DRAFT --> SUBMITTED',
  async t => {
    // Create user on DB
    t.is((await userService.getAllUsers()).length, 0);
    contractOwner = await userService.createUser(
      'test',
      'test@test.test',
      accounts[0],
      'test-avatar'
    );
    const user = await userService.createUser(
      'test2',
      'test2@test.test',
      accounts[1],
      'test-avatar2'
    );
    t.is((await userService.getAllUsers()).length, 2);

    // Create an article-draft on DB
    t.is((await articleSubmissionService.getAllSubmissions()).length, 0);
    await articleSubmissionService.createSubmission(user.ethereumAddress);
    const articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];

    // await articleSubmissionService.createSubmission(user.ethereumAddress);
    // const articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];

    t.is(articleSubmission.articleVersions.length, 1);
    let articleVersion = articleSubmission.articleVersions[0];
    t.is(articleVersion.articleVersionState, ArticleVersionState.DRAFT);

    // Send articleHash to DB
    await articleVersionService.finishDraftById(
      user.ethereumAddress,
      articleVersion._id,
      ARTICLE1_HASH_HEX
    );
    articleVersion = await articleVersionService.getArticleVersionById(
      user.ethereumAddress,
      articleVersion._id
    );
    t.is(
      articleVersion.articleVersionState,
      ArticleVersionState.FINISHED_DRAFT
    );
    t.is(articleVersion.articleHash, ARTICLE1_HASH_HEX);

    //  Submission on the SC //TODO fix, why it does not find the user in DB?
    //   await submitArticle(eurekaTokenContract, user.ethereumAddress, eurekaPlatformContract.options.address, 5000, ARTICLE1_DATA_IN_HEX);
    //   articleVersion = await articleVersionService.getArticleVersionById(user.ethereumAddress, articleVersion._id);
    //   let counter = 0;
    //   while (
    //     articleVersion.articleVersionState === ArticleVersionState.FINISHED_DRAFT &&
    //     counter < 5) {
    //     sleepSync(5000);
    //     articleVersion = await articleVersionService.getArticleVersionById(user.ethereumAddress, articleVersion._id);
    //     counter++;
    //   }
    //   t.is(articleVersion.articleVersionState, ArticleVersionState.SUBMITTED);
  }
);

test(
  PRETEXT + 'Assignment, Change and Remove of Editor for Submission Process',
  async t => {
    // Create author and editor
    const testAccounts = await getAccounts(web3);
    const author = await userService.createUser(
      'testAuthor',
      'author@test.test',
      contractOwner,
      'test-author-avatar'
    );
    const editor = await userService.createUser(
      'testEditor',
      'editor@test.test',
      testAccounts[2],
      'test-editor-avatar'
    );
    const editor2 = await userService.createUser(
      'testEditor2',
      'editor2@test.test',
      testAccounts[3],
      'test-editor2-avatar'
    );
    t.is(true, true);

    // Signup editor 1 & 2
    await signUpEditor(
      eurekaPlatformContract,
      editor.ethereumAddress,
      contractOwner
    );
    await signUpEditor(
      eurekaPlatformContract,
      editor2.ethereumAddress,
      contractOwner
    );

    // Setup article draft
    await articleSubmissionService.createSubmission(author.ethereumAddress);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];
    await articleVersionService.finishDraftById(
      author.ethereumAddress,
      articleVersion._id,
      ARTICLE1_HASH_HEX
    );

    // Submit articleHash on SC
    await submitArticle(
      eurekaTokenContract,
      author.ethereumAddress,
      eurekaPlatformContract.options.address,
      5000,
      ARTICLE1_DATA_IN_HEX
    );
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );

    let counter = 0;
    while (
      typeof articleSubmission.scSubmissionID === 'undefined' &&
      counter < 5
    ) {
      sleepSync(5000);
      articleSubmission = await articleSubmissionService.getSubmissionById(
        articleSubmission._id
      );
      counter++;
    }

    // Assign first editor for submission process
    await assignForSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      editor.ethereumAddress
    );
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, editor.ethereumAddress);

    // Change editor to editor2 for the submission process
    await changeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      editor2.ethereumAddress
    );
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, editor2.ethereumAddress);

    // Remove editor from the submission process
    await removeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      editor2.ethereumAddress
    );
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, undefined);
  }
);

test(PRETEXT + 'Submission of article, Sanity-Check', async t => {
  // Create author and editor
  const testAccounts = await getAccounts(web3);
  const author = await userService.createUser(
    'testAuthor',
    'author@test.test',
    contractOwner,
    'test-author-avatar'
  );
  const editor = await userService.createUser(
    'testEditor',
    'editor@test.test',
    testAccounts[4],
    'test-editor-avatar'
  );

  // Setup article draft 1 & 2
  await articleSubmissionService.createSubmission(author.ethereumAddress);
  let articleSubmission1 = (await articleSubmissionService.getAllSubmissions())[0];
  let articleVersion1 = articleSubmission1.articleVersions[0];
  await articleVersionService.finishDraftById(
    author.ethereumAddress,
    articleVersion1._id,
    ARTICLE1_HASH_HEX
  );

  await articleSubmissionService.createSubmission(author.ethereumAddress);
  let articleSubmission2 = (await articleSubmissionService.getAllSubmissions())[1];
  let articleVersion2 = articleSubmission2.articleVersions[0];
  await articleVersionService.finishDraftById(
    author.ethereumAddress,
    articleVersion2._id,
    ARTICLE2_HASH_HEX
  );

  // Signup editor and submit article 1 & 2
  await signUpEditor(
    eurekaPlatformContract,
    editor.ethereumAddress,
    contractOwner
  );
  await submitArticle(
    eurekaTokenContract,
    author.ethereumAddress,
    eurekaPlatformContract.options.address,
    5000,
    ARTICLE1_DATA_IN_HEX
  );
  await submitArticle(
    eurekaTokenContract,
    author.ethereumAddress,
    eurekaPlatformContract.options.address,
    5000,
    ARTICLE2_DATA_IN_HEX
  );

  let articleSubmissions = await articleSubmissionService.getAllSubmissions();
  t.is(articleSubmissions.length, 2);

  let counter = 0;
  while (
    (typeof articleSubmissions[0].scSubmissionID === 'undefined' ||
      typeof articleSubmissions[1].scSubmissionID === 'undefined') &&
    counter < 5
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }

  // TODO try sanity check without being assign first --> expected behavior: must fail
  // assign editor for the submission process of article 1 & 2
  await assignForSubmissionProcess(
    eurekaPlatformContract,
    articleSubmissions[0].scSubmissionID,
    editor.ethereumAddress
  );
  articleSubmission1 = await articleSubmissionService.getSubmissionById(
    articleSubmissions[0]._id
  );
  t.is(articleSubmission1.editor, editor.ethereumAddress);

  await assignForSubmissionProcess(
    eurekaPlatformContract,
    articleSubmissions[1].scSubmissionID,
    editor.ethereumAddress
  );
  articleSubmission2 = await articleSubmissionService.getSubmissionById(
    articleSubmissions[1]._id
  );
  t.is(articleSubmission2.editor, editor.ethereumAddress);

  // Accept sanity check for article 1
  articleVersion1 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion1._id
  );
  t.is(articleVersion1.articleVersionState, ArticleVersionState.SUBMITTED);
  await setSanityToOk(
    eurekaPlatformContract,
    articleVersion1.articleHash,
    editor.ethereumAddress
  );
  articleVersion1 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion1._id
  );

  // Check for SC status change
  counter = 0;
  while (
    articleVersion1.articleVersionState === ArticleVersionState.SUBMITTED &&
    counter < 5
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }
  t.is(articleVersion1.articleVersionState, ArticleVersionState.EDITOR_CHECKED);

  // Decline sanity check for article 2
  articleVersion2 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion2._id
  );
  t.is(articleVersion2.articleVersionState, ArticleVersionState.SUBMITTED);
  await setSanityIsNotOk(
    eurekaPlatformContract,
    articleVersion2.articleHash,
    editor.ethereumAddress
  );
  articleVersion2 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion2._id
  );

  // Check for SC status change
  counter = 0;
  while (
    articleVersion2.articleVersionState === ArticleVersionState.SUBMITTED &&
    counter < 5
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }
  t.is(
    articleVersion2.articleVersionState,
    ArticleVersionState.DECLINED_SANITY_NOTOK
  );
});

/**************** Invite reviewers for review article & Reviewers accept Invitation  ******************/
test.only(
  PRETEXT +
    'Invite reviewers for review article & Reviewers accept Invitation ',
  async t => {
    // Create author and editor
    const testAccounts = await getAccounts(web3);
    const author = await userService.createUser(
      'testAuthor',
      'author@test.test',
      contractOwner,
      'test-author-avatar'
    );
    const editor = await userService.createUser(
      'testEditor',
      'editor@test.test',
      testAccounts[4],
      'test-editor-avatar'
    );

    const reviewer1 = await userService.createUser(
      'testReviewer1',
      'reviewer1@test.test',
      testAccounts[5],
      'test-reviewer-avatar'
    );
    const reviewer2 = await userService.createUser(
      'testReviewer2',
      'reviewer2@test.test',
      testAccounts[6],
      'test-reviewer-avatar'
    );
    const reviewer3 = await userService.createUser(
      'testReviewer3',
      'reviewer3@test.test',
      testAccounts[7],
      'test-reviewer-avatar'
    );

    // Setup article draft 1 & 2
    await articleSubmissionService.createSubmission(author.ethereumAddress);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];
    await articleVersionService.finishDraftById(
      author.ethereumAddress,
      articleVersion._id,
      ARTICLE1_HASH_HEX
    );

    // Signup editor and submit article 1 & 2
    await signUpEditor(
      eurekaPlatformContract,
      editor.ethereumAddress,
      contractOwner
    );
    await submitArticle(
      eurekaTokenContract,
      author.ethereumAddress,
      eurekaPlatformContract.options.address,
      5000,
      ARTICLE1_DATA_IN_HEX,
      80000000
    );

    let counter = 0;
    while (
      typeof articleSubmission.scSubmissionID === 'undefined' &&
      counter < 5
    ) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
      counter++;
    }

    // Assign editor for the submission process of article
    await assignForSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      editor.ethereumAddress
    );

    // Accept sanity check for article 1
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    await setSanityToOk(
      eurekaPlatformContract,
      articleVersion.articleHash,
      editor.ethereumAddress
    );

    // Invite reviewers
    t.is(articleVersion.editorApprovedReviews.length, 0);
    await inviteReviewersForArticle(
      eurekaPlatformContract,
      articleVersion.articleHash,
      [reviewer1.ethereumAddress, reviewer2.ethereumAddress],
      editor.ethereumAddress
    );

    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );

    // Check if article-version in DB holds reviewers
    counter = 0;
    while (articleVersion.editorApprovedReviews.length < 2 && counter < 5) {
      sleepSync(5000);
      articleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(articleVersion.editorApprovedReviews.length, 2);

    // Reviewer1 accept --> check for new state in DB
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer1.ethereumAddress
    );
    let review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      articleVersion.editorApprovedReviews[0]
    );
    counter = 0;
    while (review.reviewState === ReviewState.INVITED && counter < 5) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        articleVersion.editorApprovedReviews[0]
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.INVITATION_ACCEPTED);

    // Reviewer2 accept --> check for new state in DB
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer2.ethereumAddress
    );
    let review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      articleVersion.editorApprovedReviews[1]
    );
    counter = 0;
    while (review2.reviewState === ReviewState.INVITED && counter < 5) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        articleVersion.editorApprovedReviews[1]
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.INVITATION_ACCEPTED);

    // Add editor-approved review1 into DB
    await reviewService.addEditorApprovedReview(
      reviewer1.ethereumAddress,
      review._id,
      REVIEW1.reviewText,
      REVIEW1_HASH_HEX,
      REVIEW1.score1,
      REVIEW1.score2,
      REVIEW1.articleHasMajorIssues,
      REVIEW1.articleHasMinorIssues
    );

    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    t.is(review.reviewState, ReviewState.HANDED_IN_DB);

    // Add review1 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW1_HASH_HEX,
      REVIEW1.articleHasMajorIssues,
      REVIEW1.articleHasMinorIssues,
      REVIEW1.score1,
      REVIEW1.score2,
      reviewer1.ethereumAddress
    );

    // Check if status changed on DB
    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    counter = 0;
    while (review.reviewState === ReviewState.HANDED_IN_DB && counter < 5) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.HANDED_IN_SC);

    // Add editor-approved review2 into DB
    await reviewService.addEditorApprovedReview(
      reviewer2.ethereumAddress,
      review2._id,
      REVIEW2.reviewText,
      REVIEW2_HASH_HEX,
      REVIEW2.score1,
      REVIEW2.score2,
      REVIEW2.articleHasMajorIssues,
      REVIEW2.articleHasMinorIssues
    );

    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    t.is(review2.reviewState, ReviewState.HANDED_IN_DB);

    // Add review2 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW2_HASH_HEX,
      REVIEW2.articleHasMajorIssues,
      REVIEW2.articleHasMinorIssues,
      REVIEW2.score1,
      REVIEW2.score2,
      reviewer2.ethereumAddress
    );

    // Check if status changed on DB
    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    counter = 0;
    while (review2.reviewState === ReviewState.HANDED_IN_DB && counter < 5) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.HANDED_IN_SC);

    // Write a community review as reviewer3
    t.is(articleVersion.communityReviews.length, 0);
    let review3 = await reviewService.addNewCommunitydReview(
      reviewer3.ethereumAddress,
      articleVersion.articleHash,
      REVIEW3.reviewText,
      REVIEW3_HASH_HEX,
      REVIEW3.score1,
      REVIEW3.score2,
      REVIEW3.articleHasMajorIssues,
      REVIEW3.articleHasMinorIssues
    );
    review3 = await reviewService.getReviewById(
      reviewer3.ethereumAddress,
      review3._id
    );
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    t.is(articleVersion.communityReviews.length, 1);

    t.is(review3.reviewState, ReviewState.HANDED_IN_DB);
    await addCommunityReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW3_HASH_HEX,
      REVIEW3.articleHasMajorIssues,
      REVIEW3.articleHasMinorIssues,
      REVIEW3.score1,
      REVIEW3.score2,
      reviewer3.ethereumAddress
    );

    review3 = await reviewService.getReviewById(
      reviewer3.ethereumAddress,
      review3._id
    );

    counter = 0;
    while (review3.reviewState === ReviewState.HANDED_IN_DB && counter < 5) {
      sleepSync(5000);
      review3 = await reviewService.getReviewById(
        reviewer3.ethereumAddress,
        review3._id
      );
      counter++;
    }
    t.is(review3.reviewState, ReviewState.HANDED_IN_SC);

    // Accept review1
    await acceptReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer1.ethereumAddress,
      editor.ethereumAddress
    );
    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    counter = 0;
    while (review.reviewState === ReviewState.HANDED_IN_SC && counter < 5) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.ACCEPTED);

    // Decline review2
    await declineReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer2.ethereumAddress,
      editor.ethereumAddress
    );
    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    counter = 0;
    while (review2.reviewState === ReviewState.HANDED_IN_SC && counter < 5) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        review2._id
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.DECLINED);
  }
);
