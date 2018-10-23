/**
 *
 * Process: Article submission v1, SanitiyCheck v1 fails --> new ReviewRound
 *
 */
import test from 'ava';
import app from '../../src/backend/api/api.mjs';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import {cleanDB} from '../helpers.js';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import web3 from '../../src/helpers/web3Instance.mjs';
import dotenv from 'dotenv';
import {setupWeb3Interface} from '../../src/backend/web3/web3InterfaceSetup.mjs';
import {deploy} from '../../src/smartcontracts/deployment/deployer-and-mint.mjs';
import {
  TEST_ARTICLE_1_DATA_IN_HEX,
  TEST_ARTICLE_1_HASH_HEX,
  TEST_ARTICLE_2_DATA_IN_HEX,
  TEST_ARTICLE_2_HASH_HEX,
  NO_ISSUES_REVIEW_1,
  NO_ISSUES_REVIEW_1_HASH_HEX,
  NO_ISSUES_REVIEW_2,
  NO_ISSUES_REVIEW_2_HASH_HEX,
  MINOR_ISSUES_REVIEW_1,
  MINOR_ISSUES_REVIEW_1_HASH_HEX,
  MINOR_ISSUES_REVIEW_2,
  MINOR_ISSUES_REVIEW_2_HASH_HEX,
  createUserContractOwner,
  setAccounts,
  createUser1,
  createEditor1,
  createEditor2,
  createReviewer1,
  createReviewer2,
  createReviewer3,
  createReviewer4,
  TEST_ARTICLE_2,
  TEST_ARTICLE_1_SECOND_VERSION,
  MAJOR_ISSUE_REVIEW_1,
  MAJOR_ISSUE_REVIEW_1_HASH_HEX,
  MAJOR_ISSUE_REVIEW_2,
  MAJOR_ISSUE_REVIEW_2_HASH_HEX, MAJOR_ISSUE_REVIEW_3, MAJOR_ISSUE_REVIEW_3_HASH_HEX
} from '../test-data';
import TestFunctions from '../test-functions';
import ArticleSubmissionState from '../../src/backend/schema/article-submission-state-enum.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;

const PRETEXT = 'Sanity-Check Fail: ';

/** ****************************************** TESTING ********************************************/

test.before(async () => {
  accounts = await getAccounts(web3);
  setAccounts(accounts);
  await dotenv.config();

  await app.setupApp();
  await app.listenTo(process.env.PORT || 8080);
});

test.beforeEach(async () => {
  await cleanDB();
  let [tokenContract, platformContract] = await deploy();
  await setupWeb3Interface(platformContract, tokenContract);
  eurekaPlatformContract = platformContract;
  eurekaTokenContract = tokenContract;
  TestFunctions.setContractsForTestingFunctions(eurekaPlatformContract, eurekaTokenContract);
});

test.after(async () => {
  await app.close();
});


test.only(
  PRETEXT + ' Decline reviews -> not possible to accept submission. ' +
  ' Accept reviews afterwards --> accept submission',
  async t => {
    // Create author, editor and reviewers
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    const reviewer1 = await createReviewer1();
    const reviewer2 = await createReviewer2();
    const reviewer3 = await createReviewer3();
    const editorApprovedReviewers = [reviewer1, reviewer2, reviewer3];

    await TestFunctions.signUpEditorAndTest(t, editor);

    // setup article-submission
    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);
    await TestFunctions.acceptSanityCheckAndTest(t, editor, author, articleVersion);

    // setup reviewers
    await TestFunctions.inviteReviewersAndTest(t, editor, author, editorApprovedReviewers, articleVersion);
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];
    await TestFunctions.acceptInvitationAndTest(t, editorApprovedReviewers[0], 0, articleVersion);
    await TestFunctions.acceptInvitationAndTest(t, editorApprovedReviewers[1], 1, articleVersion);
    await TestFunctions.acceptInvitationAndTest(t, editorApprovedReviewers[2], 2, articleVersion);

    // Get the reviews from DB
    let review1 = await reviewService.getReviewById(reviewer1.ethereumAddress, articleVersion.editorApprovedReviews[0]);
    let review2 = await reviewService.getReviewById(reviewer2.ethereumAddress, articleVersion.editorApprovedReviews[1]);
    let review3 = await reviewService.getReviewById(reviewer3.ethereumAddress, articleVersion.editorApprovedReviews[2]);

    // Add editor-approved review into DB
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer1, review1, MAJOR_ISSUE_REVIEW_1, MAJOR_ISSUE_REVIEW_1_HASH_HEX, articleVersion);
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer2, review2, MAJOR_ISSUE_REVIEW_2, MAJOR_ISSUE_REVIEW_2_HASH_HEX, articleVersion);
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer3, review3, MAJOR_ISSUE_REVIEW_3, MAJOR_ISSUE_REVIEW_3_HASH_HEX, articleVersion);

    //update from DB
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];


    await TestFunctions.declineReviewAndTest(t, editor, review1, articleVersion);
    await TestFunctions.declineReviewAndTest(t, editor, review2, articleVersion);
    await TestFunctions.declineReviewAndTest(t, editor, review3, articleVersion);

    // await t.throws(await TestFunctions.acceptArticleVersionAndTest(t, editor, articleVersion));

    t.throws(async () => {await TestFunctions.acceptArticleVersionAndTest(t, editor, articleVersion);}, TypeError);
  }
);