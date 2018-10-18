/**
 * Basic integration test for the interaction of the smart contract
 * and the monitor of the DB.
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
  REVIEW_1,
  REVIEW_1_HASH_HEX,
  REVIEW_2,
  REVIEW_2_HASH_HEX,
  REVIEW_3,
  REVIEW_3_HASH_HEX,
  REVIEW_4,
  REVIEW_4_HASH_HEX,
  createUserContractOwner,
  setAccounts,
  createUser1, createEditor1, createEditor2, createReviewer1, createReviewer2, createReviewer3, createReviewer4
} from '../test-data';
import TestFunctions from '../test-functions';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;

const PRETEXT = 'BASIC INTEGRATION: ';

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

/************************ Sign up Editor ************************/
test(PRETEXT + 'Sign up Editor', async t => {
  let user = await createUserContractOwner();
  t.is(user.roles.length, 1);
  t.is(user.roles[0], Roles.CONTRACT_OWNER);

  await TestFunctions.signUpEditorAndTest(t, user);
});


/************************ Submit an Article &  auto change of Status from DRAFT --> SUBMITTED ************************/
test(
  PRETEXT +
  'Submit an Article &  auto change of Status from DRAFT --> SUBMITTED',
  async t => {
    // Create user on DB
    t.is((await userService.getAllUsers()).length, 0);
    await createUserContractOwner();
    const user1 = await createUser1();
    t.is((await userService.getAllUsers()).length, 2);

    await TestFunctions.createArticleDraftAndSubmitIt(t, user1, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
  }
);

test(
  PRETEXT + 'Assignment, Change and Remove of Editor for Submission Process',
  async t => {
    // Create author and editor 1 & 2
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    const editor2 = await createEditor2();

    // Sign up editor1 & 2
    await TestFunctions.signUpEditorAndTest(t, editor);
    await TestFunctions.signUpEditorAndTest(t, editor2);

    // Submit article
    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];

    // Assign first editor for submission process
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);
    // Change to second editor for submission process
    await TestFunctions.changeEditorForSubmissionProcess(t, editor2, articleSubmission);

    await TestFunctions.removeEditorFromSubmissionProcessAndTest(t, editor2, articleSubmission);
  }
);

test(PRETEXT + 'Submission of article, Sanity-Check', async t => {
  // Create author and editor
  const author = await createUserContractOwner();
  const editor = await createEditor1();

  // Submit article 1 & 2
  await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
  await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_2_HASH_HEX, TEST_ARTICLE_2_DATA_IN_HEX);

  let articleSubmission1 = (await articleSubmissionService.getAllSubmissions())[0];
  let articleVersion1 = articleSubmission1.articleVersions[0];
  let articleSubmission2 = (await articleSubmissionService.getAllSubmissions())[1];
  let articleVersion2 = articleSubmission2.articleVersions[0];

  // Signup editor & assign him for article 1 & 2
  await TestFunctions.signUpEditorAndTest(t, editor);
  await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission1);
  await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission2);

  // Accept sanity-check for article 1
  await TestFunctions.acceptSanityCheckAndTest(t, editor, author, articleVersion1);

  // Decline sanity-check for article 2
  await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleSubmission2, articleVersion2);
});

/**************** Article acception ******************/
test(
  PRETEXT +
  'Article acception',
  async t => {
    // Create author and editor
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    const reviewer1 = await createReviewer1();
    const reviewer2 = await createReviewer2();
    const reviewer3 = await createReviewer3();
    const editorApprovedReviewers = [reviewer1, reviewer2, reviewer3];
    const reviewer4 = await createReviewer4();

    // Setup article draft
    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];

    // Signup editor & assign him on article
    await TestFunctions.signUpEditorAndTest(t, editor);
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);

    // Accept sanity check for article 1
    await TestFunctions.acceptSanityCheckAndTest(t, editor, author, articleVersion);

    // Invite reviewers 1,2 & 3 to become editor-approved reviewers
    await TestFunctions.inviteReviewersAndTest(t, editor, author, editorApprovedReviewers, articleVersion);

    //update from DB
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
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer1, review1, REVIEW_1, REVIEW_1_HASH_HEX, articleVersion);
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer2, review2, REVIEW_2, REVIEW_2_HASH_HEX, articleVersion);
    await TestFunctions.addEditorApprovedReviewAndTest(t, reviewer3, review3, REVIEW_3, REVIEW_3_HASH_HEX, articleVersion);

    //update from DB
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];

    // Add a community review as reviewer4
    await TestFunctions.addNewCommunitydReviewAndTest(t, reviewer4, REVIEW_4, REVIEW_4_HASH_HEX, author, articleVersion);

    // Accept review1 & review2, decline review3
    await TestFunctions.acceptReviewAndTest(t, editor, review1, articleVersion);
    await TestFunctions.acceptReviewAndTest(t, editor, review2, articleVersion);
    await TestFunctions.declineReviewAndTest(t, editor, review3, articleVersion);

    // Accept ArticleVersion
    await TestFunctions.acceptArticleVersionAndTest(t, editor, articleVersion);
  }
);
