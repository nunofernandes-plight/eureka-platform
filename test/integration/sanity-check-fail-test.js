
import test from 'ava';
import app from '../../src/backend/api/api.mjs';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import {cleanDB} from '../helpers.js';
import web3 from '../../src/helpers/web3Instance.mjs';
import dotenv from 'dotenv';
import {setupWeb3Interface} from '../../src/backend/web3/web3InterfaceSetup.mjs';
import {deployAndMint} from '../../src/smartcontracts/deployment/deployer-and-mint.mjs';
import {
  TEST_ARTICLE_1_DATA_IN_HEX,
  TEST_ARTICLE_1_HASH_HEX,
  TEST_ARTICLE_2_HASH_HEX,
  createUserContractOwner,
  setAccounts,
  createEditor1,
  TEST_ARTICLE_1_SECOND_VERSION, TEST_ARTICLE_2, TEST_ARTICLE_3
} from '../test-data/test-data';
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
  let [tokenContract, platformContract] = await deployAndMint();
  await setupWeb3Interface(platformContract, tokenContract);
  eurekaPlatformContract = platformContract;
  eurekaTokenContract = tokenContract;
  TestFunctions.setContractsForTestingFunctions(eurekaPlatformContract, eurekaTokenContract);
});

test.after(async () => {
  await app.close();
});

/************************ Decline SanityCheck v1, Accept SanityCheck v2 ************************/

test(
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

    // Decline sanity-check for article
    await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleSubmission, articleVersion, ArticleSubmissionState.NEW_REVIEW_ROUND_REQUESTED);

    // Update test-data
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];

    // Open new review round
    await TestFunctions.openNewReviewRoundAndTest(t, author, articleSubmission.scSubmissionID, articleVersion, TEST_ARTICLE_2);

    // Get the new article-version
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[1];

    // TODO accept second round and test if is submitted afterwards
    await TestFunctions.acceptSanityCheckAndTest(t, editor, author, articleVersion);
  }
);

test(
  PRETEXT +
  'Decline SanityCheck multiple times -> must loop forever',
  async t => {
    // Setup environment
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    await TestFunctions.signUpEditorAndTest(t, editor);

    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);

    // Decline sanity first time
    await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleSubmission, articleVersion, ArticleSubmissionState.NEW_REVIEW_ROUND_REQUESTED);
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[0];

    // Open new review round and get data
    await TestFunctions.openNewReviewRoundAndTest(t, author, articleSubmission.scSubmissionID, articleVersion, TEST_ARTICLE_2);
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[1];

    // Decline sanity second time
    await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleSubmission, articleVersion, ArticleSubmissionState.NEW_REVIEW_ROUND_REQUESTED);
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[1];

    // Open new review round and get data
    await TestFunctions.openNewReviewRoundAndTest(t, author, articleSubmission.scSubmissionID, articleVersion, TEST_ARTICLE_3);
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    articleVersion = articleSubmission.articleVersions[2];

    // // Decline sanity third time
    await TestFunctions.declineSanityCheckAndTest(t, editor, author, articleSubmission, articleVersion, ArticleSubmissionState.NEW_REVIEW_ROUND_REQUESTED);
  }
);