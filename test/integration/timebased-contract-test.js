import test from 'ava';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import web3 from '../../src/helpers/web3Instance.mjs';
import {
  createEditor1,
  createUserContractOwner,
  setAccounts,
  TEST_ARTICLE_1_DATA_IN_HEX,
  TEST_ARTICLE_1_HASH_HEX
}
  from '../test-data/test-data.js';
import dotenv from 'dotenv';
import app from '../../src/backend/api/api.mjs';
import {cleanDB} from '../helpers.js';
import {deployAndMint} from '../../src/smartcontracts/deployment/deployer-and-mint.mjs';
import {setupWeb3Interface} from '../../src/backend/web3/web3InterfaceSetup.mjs';
import TestFunctions from '../test-functions.js';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';
import {sleepSync} from '../helpers';
import articleVersionService from '../../src/backend/db/article-version-service.mjs';
import ArticleSubmissionState from '../../src/backend/schema/article-submission-state-enum.mjs';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;

const PRETEXT = 'TIME BASED CONTRACT INTEGRATION: ';

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
  [platformContract, tokenContract] = await setupWeb3Interface(platformContract, tokenContract);
  eurekaPlatformContract = platformContract;
  eurekaTokenContract = tokenContract;
  TestFunctions.setContractsForTestingFunctions(eurekaPlatformContract, eurekaTokenContract);
});

test.after(async () => {
  await app.close();
});

test(PRETEXT + 'Remove of editor after timeout', async t => {
  const contract_owner = await createUserContractOwner();
  const editor = await createEditor1();

  await TestFunctions.timeoutRemoveEditorAndTest(
    t, contract_owner, editor, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
});