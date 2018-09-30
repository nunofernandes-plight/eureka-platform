import {signUpEditor} from '../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import userService from '../src/backend/db/user-service.mjs';
import Roles from '../src/backend/schema/roles-enum.mjs';
import {sleepSync} from './helpers.js';
import articleSubmissionService from '../src/backend/db/article-submission-service.mjs';
import ArticleVersionState from '../src/backend/schema/article-version-state-enum.mjs';
import articleVersionService from '../src/backend/db/article-version-service.mjs';

let eurekaPlatformContract;
let eurekaTokenContract;
let contractOwner;

export default {
  setContractsForTestingFunctions: function(_eurekaPlatformContract, _eurekaTokenContract, _contractOwnerAddress) {
    eurekaPlatformContract = _eurekaPlatformContract;
    eurekaTokenContract = _eurekaTokenContract;
    contractOwner = _contractOwnerAddress;
  },

  /**
   *  Signs up the provided user as an Editor on the SC.
   *  Afterwards checks if the user has become an Editor on the DB as well
   * @param t
   * @param user
   * @returns {Promise<*>}
   */
  signUpEditorAndTest: async function(t, user) {
    const rolesLength = user.roles.length;
    const scTransactionLength = user.scTransactions.length;
    let dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
    t.is(true, true);

    t.is(dbUser.roles.includes(Roles.EDITOR), false);
    await signUpEditor(eurekaPlatformContract, user.ethereumAddress).send({
      from: contractOwner
    });

    dbUser = await userService.getUserByEthereumAddressWithScTransactions(
      user.ethereumAddress
    );

    let counter = 0;
    while (dbUser.scTransactions.length < scTransactionLength && counter < 5) {
      sleepSync(5000);
      dbUser = await userService.getUserByEthereumAddressWithScTransactions(
        contractOwner
      );
      counter++;
    }
    t.is(dbUser.roles.length, rolesLength + 1);
    t.is(dbUser.roles[rolesLength], Roles.EDITOR);
    return t;
  },

  createArticleDraftAndSubmitIt: async function(t, user, articleHashHex) {
    // Create an article-draft on DB
    const articleSubmissionslength = (await articleSubmissionService.getAllSubmissions()).length;
    await articleSubmissionService.createSubmission(user.ethereumAddress);
    const articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];

    t.is(articleSubmission.articleVersions.length, 1);
    let articleVersion = articleSubmission.articleVersions[0];
    t.is(articleVersion.articleVersionState, ArticleVersionState.DRAFT);

    // Send articleHash to DB
    await articleVersionService.finishDraftById(
      user.ethereumAddress,
      articleVersion._id,
      articleHashHex
    );

    articleVersion = await articleVersionService.getArticleVersionById(
      user.ethereumAddress,
      articleVersion._id
    );
    t.is(
      articleVersion.articleVersionState,
      ArticleVersionState.FINISHED_DRAFT
    );
    t.is(articleVersion.articleHash, articleHashHex);

    // TODO submission on SC
    return t;

  }
};