import {createDifferentUsers} from './createDifferentUsers.mjs';
import app from '../../src/backend/api/api.mjs';
import User from '../../src/backend/schema/user.mjs';
import ArticleSubmission from '../../src/backend/schema/article-submission.mjs';
import Review from '../../src/backend/schema/review.mjs';
import ArticleVersion from '../../src/backend/schema/article-version.mjs';
import ScTransactions from '../../src/backend/schema/sc-transaction.mjs';
import {
  createDifferentDrafts,
  submitDifferentArticles
} from './createDifferentArticles.mjs';
import platformContractABI from '../../src/smartcontracts/constants/GanachePlatformContractABI.json';
import tokenContractABI from '../../src/smartcontracts/constants/GanacheTokenContractABI.json';
import platformContractAddress from '../../src/smartcontracts/constants/GanachePlatformContractAddress.json';
import tokenContractAddress from '../../src/smartcontracts/constants/GanacheTokenContractAddress.json';
import web3 from '../../src/helpers/web3Instance.mjs';
import {CREATE_DRAFTS, SUBMIT_ALL_ARTICLES} from './scenariosNames.mjs';
import {platformContract} from '../../src/backend/web3/web3InterfaceSetup.mjs';

const cleanCollections = async () => {
  await User.remove({});
  await ArticleSubmission.remove({});
  await Review.remove({});
  await ArticleVersion.remove({});
  await ScTransactions.remove({});
  console.log('Collections have been cleaned');
};

const setupContracts = async () => {
  const platformContract = new web3.eth.Contract(
    platformContractABI,
    platformContractAddress
  );
  const tokenContract = new web3.eth.Contract(
    tokenContractABI,
    tokenContractAddress
  );

  return [platformContract, tokenContract];
};
const start = async () => {
  await cleanCollections();
  app.setupApp();
  app.listenTo(process.env.PORT || 8080);
  const [platformContract, tokenContract] = await setupContracts();
  startScenario(platformContract, tokenContract);
  /*  await createDifferentUsers();
  await createDifferentDrafts();
  await submitDifferentArticles(tokenContract, platformContract);*/
};

const startScenario = async (platformContract, tokenContract) => {
  await createDifferentUsers();
  switch (process.env.SCENARIO) {
    case CREATE_DRAFTS:
       await createDifferentDrafts();
       break;

    case SUBMIT_ALL_ARTICLES:
      await createDifferentDrafts();
      await submitDifferentArticles(tokenContract, platformContract);
      break;

    default:
      console.err(
        'No valid scenario has been set as env. variable. For possible scenario names check the scenarioNames.mjs file'
      );
  }
};

start();
