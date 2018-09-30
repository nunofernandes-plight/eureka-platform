import {
  signUpEditor,
  assignForSubmissionProcess,
  changeEditorFromSubmissionProcess,
  removeEditorFromSubmissionProcess,
  setSanityToOk
} from '../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import userService from '../src/backend/db/user-service.mjs';
import Roles from '../src/backend/schema/roles-enum.mjs';
import {sleepSync} from './helpers.js';
import articleSubmissionService from '../src/backend/db/article-submission-service.mjs';
import ArticleVersionState from '../src/backend/schema/article-version-state-enum.mjs';
import articleVersionService from '../src/backend/db/article-version-service.mjs';
import {submitArticle} from '../src/smartcontracts/methods/web3-token-contract-methods.mjs';

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

  /**
   * Create an articleDraft on the DB and submit it afterward to the SC.
   * Test if the articleVersion has Status 'SUBMITTED' at the end.
   * @param t
   * @param user
   * @param articleHashHex
   * @param articleDataInHex
   * @returns {Promise<*>}
   */
  createArticleDraftAndSubmitIt: async function(t, user, articleHashHex, articleDataInHex) {
    // Create an article-draft on DB
    const articleSubmissionslength = (await articleSubmissionService.getAllSubmissions()).length;
    await articleSubmissionService.createSubmission(user.ethereumAddress);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];

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


    // Submit articleHash on SC
    await submitArticle(
      eurekaTokenContract,
      eurekaPlatformContract.options.address,
      5000,
      articleDataInHex
    ).send({
      from: user.ethereumAddress,
      gas: 80000000
    });

    articleVersion = await articleVersionService.getArticleVersionById(
      user.ethereumAddress,
      articleVersion._id
    );
    let counter = 0;
    while (articleVersion.articleVersionState === ArticleVersionState.FINISHED_DRAFT && counter < 5) {
      sleepSync(5000);
      articleVersion = await articleVersionService.getArticleVersionById(
        user.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(articleVersion.articleVersionState, ArticleVersionState.SUBMITTED);

    // test if submission exist
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
    counter = 0;
    while (!articleSubmission && counter < 5) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
      counter++;
    }

    // test if scSubmissionID is on DB
    counter = 0;
    while (articleSubmission.scSubmissionID !== articleSubmissionslength && counter < 5) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
      counter++;
    }

    t.is(articleSubmission.scSubmissionID, articleSubmissionslength);
    return t;
  },

  /**
   * Assigns the editor provided on the articleSubmission.
   * Works only of the ethereumAddress of the editor is assigned as editor
   * in the SC
   * @param t
   * @param editor
   * @param articleSubmission
   * @returns {Promise<void>}
   */
  assignEditorForSubmissionProcess: async function(t, editor, articleSubmission) {
    await assignForSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID
    ).send({
      from: editor.ethereumAddress
    });
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, editor.ethereumAddress);
    return t;
  },

  changeEditorForSubmissionProcess: async function(t, newEditor, articleSubmission) {
    await changeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      newEditor.ethereumAddress
    ).send({
      from: contractOwner
    });
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, newEditor.ethereumAddress);
    return t;
  },

  removeEditorFromSubmissionProcessAndTest: async function(t, editor, articleSubmission) {
    await removeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID
    ).send({
      from: editor.ethereumAddress
    });
    let dbArticleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(dbArticleSubmission.editor, null);
  },

  acceptSanityCheckAndTest: async function(t, editor, author, articleVersion) {
    await setSanityToOk(eurekaPlatformContract, articleVersion.articleHash).send({
      from: editor.ethereumAddress
    });

    let dbArticleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );

    let counter = 0;
    while (
      articleVersion.articleVersionState !==
      ArticleVersionState.EDITOR_CHECKED &&
      counter < 5
    ) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(dbArticleVersion.articleVersionState, ArticleVersionState.EDITOR_CHECKED);
  },
};