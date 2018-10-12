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

/************************ Decline SanityCheck v1, Accept SanityCheck v2 ************************/

test.only(
  PRETEXT +
  'Decline SanityCheck v1, Accept SanityCheck v2',
  async t => {
    // Create author and editor
    const author = await createUserContractOwner();
    const editor = await createEditor1();

    // Sign up editor
    await TestFunctions.signUpEditorAndTest(t, editor);

    // Submit article
    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];

    // Assign first editor for submission process
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);

    // Decline sanity-check for article 2
    await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleVersion);

    t.is(true, true);
  }
);