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
  TEST_ARTICLE_1_SECOND_VERSION,
  TEST_ARTICLE_1_SECOND_VERSION_HASH_HEX,
  TEST_ARTICLE1_SECOND_VERSION_HASH_URL,
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
  createUser1,
  createEditor1,
  createEditor2,
  createReviewer1,
  createReviewer2,
  createReviewer3,
  createReviewer4
} from '../test-data';
import TestFunctions from '../test-functions';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;

const PRETEXT = 'DECLINATION INTEGRATION: ';

/** ****************************************** TESTING ********************************************/
test.before(async () => {
  accounts = await getAccounts(web3);
  setAccounts(accounts);
  contractOwner = accounts[0];
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


/**************** Article declination & open new ReviewRound  ******************/
test.only(
  PRETEXT +
  'Article declination  ',
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

    //Decline ArticleVersion
    await TestFunctions.declineArticleVersionAndTest(t, editor, articleVersion);

    //update from DB
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];

    // //Open new Review round
    // await TestFunctions.openNewReviewRoundAndTest(t, author, articleSubmission.scSubmissionID,
    //   articleVersion, TEST_ARTICLE_1_SECOND_VERSION, TEST_ARTICLE_1_SECOND_VERSION_HASH_HEX, TEST_ARTICLE_1_SECOND_VERSION_HASH_HEX);

    //Decline new review round
    await TestFunctions.declineNewReviewRoundAndTest(t, articleSubmission.scSubmissionID, author);
  }
);