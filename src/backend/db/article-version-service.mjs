import ArticleVersion from '../schema/article-version.mjs';
import Document from '../../models/Document.mjs';
import {serializeDocument} from '../../helpers/documentSerializer.mjs';
import createNewEmpty from '../../helpers/createEditorDocument.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionStates from '../schema/article-version-state-enum.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import ReviewService from './review-service.mjs';
import ArticleSubmissionService from './article-submission-service.mjs';
import userService from './user-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import REVIEW_TYPE from '../schema/review-type-enum.mjs';
import {getIds} from '../helpers/get-array-of-ids.mjs';

const populate = fn => {
  return fn.populate([
    {path: 'articleSubmission'},
    {path: 'editorApprovedReviews'},
    {path: 'communityReviews'}
  ]);
};

export default {
  getAllArticleVersions: () => {
    return ArticleVersion.find({});
  },

  getArticlesAssignedTo: async (ethereumAddress, articleVersionStates) => {
    const submissions = await ArticleSubmissionService.getAssignedSubmissions(
      ethereumAddress
    );
    const submissionIds = getIds(submissions);

    return await ArticleVersion.find({
      articleVersionState: {$in: articleVersionStates},
      articleSubmission: {$in: submissionIds}
    }).populate([
      {path: 'articleSubmission'},
      {path: 'editorApprovedReviews'},
      {path: 'communityReviews'}
    ]);
  },

  getArticlesToFinalize: async ethereumAddress => {
    const submissions = await ArticleSubmissionService.getAssignedSubmissions(
      ethereumAddress
    );
    const submissionIds = getIds(submissions);

    const articlesWithEnoughEAReviews = await ReviewService.getArticlesWithEnoughAcceptedReviews(REVIEW_TYPE.EDITOR_APPROVED_REVIEW);

    return await ArticleVersion.find({
      articleVersionState: 'REVIEWERS_INVITED',
      articleSubmission: {$in: submissionIds},
      _id: {$in: getIds(articlesWithEnoughEAReviews)}
    }).populate([
      {path: 'articleSubmission'},
      {path: 'editorApprovedReviews'},
      {path: 'communityReviews'}
    ]);
  },

  getArticlesOpenForReviews: async ethereumAddress => {
    // gettin reviews first to check which articles where already reviewed
    let reviews = await ReviewService.getMyReviews(ethereumAddress);
    const alreadyReviewedIds = ReviewService.getArticleVersionIds(reviews);
    // gettin reviews which user is invited to
    reviews = await ReviewService.getReviewInvitations(ethereumAddress);
    const invitedIds = ReviewService.getArticleVersionIds(reviews);

    const submissions = await ArticleSubmissionService.getReviewableSubmissions(ethereumAddress);
    const reviewableSubmissionIds = getIds(submissions);

    return await ArticleVersion.find({
      // show article if invited or if not reviewed yet
      $or: [{_id: {$nin: alreadyReviewedIds}}, {_id: {$in: invitedIds}}],
      // community reviews can be reviewed as soon as the article is submitted
      articleVersionState: {$in: ['SUBMITTED', 'EDITOR_CHECKED', 'REVIEWERS_INVITED']},
      // article can't be reviewed by the author or submission owner itself
      ownerAddress: {$ne: ethereumAddress},
      'document.authors': {$ne: ethereumAddress},
      // article can't be reviewed by the editor of the submission process
      articleSubmission: {$in: reviewableSubmissionIds}
    }).populate([
      {path: 'articleSubmission'},
      {path: 'editorApprovedReviews'},
      {path: 'communityReviews'}
    ]);
  },

  /* tipp not used anymore
  * Query for a document nested in an array
  *   const cursor = db.collection('inventory').find({
        'instock.qty': { $lte: 20 }
      });
  * */
  getArticlesInvitedForReviewing: async ethereumAddress => {
    const reviews = await ReviewService.getReviewInvitations(ethereumAddress);
    const ids = ReviewService.getArticleVersionIds(reviews);

    return await ArticleVersion.find({
      _id: {$in: ids},
      articleVersionState: 'REVIEWERS_INVITED'
    }).populate([
      {path: 'articleSubmission'},
      {path: 'editorApprovedReviews'},
      {path: 'communityReviews'}
    ]);
  },

  getArticlesOpenForCommunityReviews: async ethereumAddress => {
    // gettin reviews first to check which articles where already reviewed
    let reviews = await ReviewService.getMyReviews(ethereumAddress);
    const alreadyReviewedIds = ReviewService.getArticleVersionIds(reviews);
    // gettin reviews which user is invited to
    reviews = await ReviewService.getReviewInvitations(ethereumAddress);
    const invitedIds = ReviewService.getArticleVersionIds(reviews);

    const submissions = await ArticleSubmissionService.getReviewableSubmissions(ethereumAddress);
    const reviewableSubmissionIds = getIds(submissions);

    return populate(
      ArticleVersion.find({
        // show article if not invited or if not reviewed yet
        $and: [{_id: {$nin: alreadyReviewedIds}}, {_id: {$nin: invitedIds}}],
        // community reviews can be reviewed as soon as the article is submitted
        articleVersionState: {$in: ['EDITOR_CHECKED', 'REVIEWERS_INVITED']},        // TODO: include SUBMITTED state: ['SUBMITTED', 'EDITOR_CHECKED', 'REVIEWERS_INVITED']},
        // article can't be reviewed by the author or submission owner itself
        ownerAddress: {$ne: ethereumAddress},
        'document.authors': {$ne: ethereumAddress},
        // article can't be reviewed by the editor of the submission process
        articleSubmission: {$in: reviewableSubmissionIds}
      })
    );
  },

  createArticleVersion: async (ethereumAddress, submissionId) => {
    const document = new Document(serializeDocument(createNewEmpty()));
    document.authors.push(ethereumAddress);

    const timestamp = new Date().getTime();
    const version = new ArticleVersion({
      articleSubmission: submissionId,
      ownerAddress: ethereumAddress,
      document,
      timestamp
    });

    let dbArticleVersion = await version.save();
    if (!dbArticleVersion) errorThrower.noCreationOfEntry('Article Version');
    return dbArticleVersion;
  },

  /**
   * Gets some infos about all the article version being in state "DRAFT"
   * for a specific user given its ethereum address
   * @param userAddress
   * @returns {Promise<Array>}
   */
  getDraftsOfUser: async userAddress => {
    let drafts = await ArticleVersion.find({
      ownerAddress: userAddress,
      articleVersionState: ArticleVersionStates.DRAFT
    });
    if (!drafts) {
      errorThrower.noEntryFoundById('EthereumAddress');
    }
    return getDraftInfos(drafts);
  },

  getSubmittedAndFinishedDraftOfUser: async userAddress => {
    const drafts = await ArticleVersion.find({
      ownerAddress: userAddress,
      $or: [
        {articleVersionState: ArticleVersionState.FINISHED_DRAFT},
        {articleVersionState: ArticleVersionState.SUBMITTED}
      ]
    });
    return getDraftInfos(drafts);
  },

  updateDraftById: async (userAddress, articleVersionId, document) => {
    // error checking
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (articleVersion.articleVersionState !== ArticleVersionStates.DRAFT)
      errorThrower.notCorrectStatus(
        ArticleVersionStates.DRAFT,
        articleVersion.articleVersionState
      );
    if (articleVersion.ownerAddress !== userAddress)
      errorThrower.notCorrectEthereumAddress();

    // add new document variables
    for (let property in document) {
      if (document.hasOwnProperty(property)) {
        articleVersion.document[property] = document[property];
      }
    }

    articleVersion.timestamp = new Date().getTime();
    await ArticleVersion.findByIdAndUpdate(articleVersionId, articleVersion);
    return 'Successful updated Article Version with ID: ' + articleVersionId;
  },

  finishDraftById: async (userAddress, articleVersionId, articleHash) => {
    // error checking
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (articleVersion.articleVersionState !== ArticleVersionStates.DRAFT)
      errorThrower.notCorrectStatus(
        ArticleVersionStates.DRAFT,
        articleVersion.articleVersionState
      );
    if (articleVersion.ownerAddress !== userAddress)
      errorThrower.notCorrectEthereumAddress();

    articleVersion.articleHash = articleHash;
    articleVersion.articleVersionState = ArticleVersionStates.FINISHED_DRAFT;

    await articleVersion.save();
    return 'Successful finished draft of article-version';
  },

  revertToDraft: async (userAddress, articleVersionId) => {
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (
      articleVersion.articleVersionState !== ArticleVersionState.FINISHED_DRAFT
    ) {
      errorThrower.notCorrectStatus(
        ArticleVersionState.FINISHED_DRAFT,
        articleVersion.articleVersionState
      );
    }
    if (articleVersion.ownerAddress !== userAddress)
      errorThrower.notCorrectEthereumAddress(userAddress);

    articleVersion.articleVersionState = ArticleVersionState.DRAFT;
    await articleVersion.save();
    return (
      'Articleversion ' +
      articleVersion._id +
      'has reverted Status: ' +
      ArticleVersionState.FINISHED_DRAFT +
      ' to ' +
      ArticleVersionState.DRAFT
    );
  },

  /**
   * Returns the article-version, but only if it is still in state 'DRAFT'
   * otherwise error
   * @param userAddress
   * @param articleVersionID
   * @returns {Promise<void>}
   */
  getArticleVersionById: async (userAddress, articleVersionID) => {
    const articleVersion = await ArticleVersion.findById(articleVersionID);
    const user = await userService.getUserByEthereumAddress(userAddress);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionID);

    // Article owner can always have a look at its article
    if (articleVersion.ownerAddress === userAddress) {
      return articleVersion;
    }
    const state = articleVersion.articleVersionState;
    // Editor can have a look at the article when it has been submitted
    if (
      state === ArticleVersionState.SUBMITTED &&
      user.roles.includes(Roles.EDITOR)
    ) {
      return articleVersion;
    }

    // after EDITOR_CHECKED the article can be visualized by anyone (open access)
    if (
      state !== ArticleVersionState.SUBMITTED &&
      state !== ArticleVersionState.FINISHED_DRAFT &&
      state !== ArticleVersionState.DRAFT
    ) {
      return articleVersion;
    }
    return errorThrower.notCorrectEthereumAddress();
  },

  changeArticleVersionState: async (articleHash, versionState) => {
    if (!(versionState in ArticleVersionState)) {
      let error = new Error(
        'Internal error: Provided param "versionState" is not a actual ArticleVersionState'
      );
      error.status = 500;
      throw error;
    }

    await ArticleVersion.findOneAndUpdate(
      {articleHash: articleHash},
      {
        articleVersionState: versionState
      }
    );
  }
};

/**
 * Extracts only specific infos out of the drafts to return to the frontend
 * @param drafts
 * @returns {Array}
 */
function getDraftInfos(drafts) {
  let draftInfos = [];
  drafts.map(draft => {
    let draftInfo = {
      document: {}
    };

    draftInfo.articleVersionState = draft.articleVersionState;
    draftInfo.articleHash = draft.articleHash;
    draftInfo._id = draft._id;
    draftInfo.document.title = draft.document.title;
    draftInfo.document.authors = draft.document.authors;
    draftInfo.timestamp = draft.timestamp;
    draftInfo.document.figure = draft.document.figure;
    draftInfos.push(draftInfo);
  });
  return draftInfos;
}
