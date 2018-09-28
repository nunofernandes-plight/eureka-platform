import ArticleVersion from '../schema/article-version.mjs';
import Document from '../../models/Document.mjs';
import {serializeDocument} from '../../helpers/documentSerializer.mjs';
import createNewEmpty from '../../helpers/createEditorDocument.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionStates from '../schema/article-version-state-enum.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import REVIEW_STATE from '../schema/review-state-enum.mjs';
import ReviewService from './review-service.mjs';

export const getRelevantArticleData = (articleVersion) => {
  let resArticle = {};

  resArticle.scSubmissionID = articleVersion.articleSubmission.scSubmissionID;
  resArticle.ownerAddress = articleVersion.articleSubmission.ownerAddress;
  resArticle.articleSubmissionState = articleVersion.articleSubmission.articleSubmissionState;

  resArticle._id = articleVersion._id;
  resArticle.articleHash = articleVersion.articleHash;
  resArticle.articleVersionState = articleVersion.articleVersionState;
  resArticle.updatedAt = articleVersion.updatedAt;

  resArticle.title = articleVersion.document.title;
  resArticle.authors = articleVersion.document.authors;
  resArticle.abstract = articleVersion.document.abstract;
  resArticle.figure = articleVersion.document.figure;
  resArticle.keywords = articleVersion.document.keywords;

  resArticle.editorApprovedReviews = articleVersion.editorApprovedReviews;
  resArticle.communityReviews = articleVersion.communityReviews;

  return resArticle;
};

const getArticlesResponse = articles => {
  let resArticles = [];
  articles.map(article => {
      resArticles.push(
        getRelevantArticleData(article)
      );
  });
  return resArticles;
};

const getFinalizableArticles = (articles) => {
  let finalizableArticles = [];
  articles.forEach(article => {
    if (isFinalizable(article))
      finalizableArticles.push(article);
  });
  return finalizableArticles;
};

const isFinalizable = article => {
  const minEAReviews = 1; //minAmountOfEditorApprovedReviews
  const minCReviews = 0; //minAmountOfCommunityReviews
  return (
    areReviewsOK(minEAReviews, article.editorApprovedReviews)
    &&
    areReviewsOK(minCReviews, article.communityReviews)
  );
};

const areReviewsOK = (minAmount, reviews) => {
  let count = 0;
  reviews.forEach(review => {
    if (review.reviewState !== REVIEW_STATE.ACCEPTED)
      return false;
    if (review.hasMajorIssues)
      return false;

    count++;
  });
  return count >= minAmount;
};

const getArticleVersionsByIdObjects = (idObjects) => {
  let ids = idObjects.map((i) => {
    return i.articleVersion;
  });
  return getArticleVersionsByIds(ids);
};

const getArticleVersionsByIds = (ids) => {
  return ArticleVersion.find({_id: {$in: ids}});
};

export default {
  getAllArticleVersions: () => {
    return ArticleVersion.find({});
  },

  getArticlesAssignedTo: async (ethereumAddress, articleVersionState) => {
    const articles = await ArticleVersion.find({articleVersionState: articleVersionState})
      .populate({
        path: 'articleSubmission',
        match: {editor: ethereumAddress}
      });
    return getArticlesResponse(articles);
  },

  getArticlesToFinalize: async (ethereumAddress) => {
    const articles = await ArticleVersion.find({
      articleVersionState: 'REVIEWERS_INVITED'
    })
      .populate({
        path: 'articleSubmission',
        match: {editor: ethereumAddress}
      })
      .populate({
        path: 'editorApprovedReviews'
      })
      .populate({
        path: 'communityReviews '
      });
    const finalizableArticles = getFinalizableArticles(articles);
    console.log(finalizableArticles);
    return getArticlesResponse(articles);
  },

  getArticlesOpenForCommunityReviews: async (ethereumAddress) => {
    // gettin reviews first to check which articles where already reviewed
    const articleVersionIdObjects = await ReviewService.getMyReviews(ethereumAddress)
      .select('articleVersion -_id');
    const ids = getArticleVersionIds(articleVersionIdObjects);

    const articles = await ArticleVersion.find({
      // hide articles already reviewed
      _id: {$nin: ids},
      articleVersionState: {$in: ['EDITOR_CHECKED', 'REVIEWERS_INVITED']},
      ownerAddress: {$ne: ethereumAddress},
      'document.authors': {$ne: ethereumAddress}
    })
      .populate([
        {path: 'articleSubmission'},
        {path: 'editorApprovedReviews'},
        {path: 'communityReviews'}
      ]);
    return getArticlesResponse(articles);
  },

  /* tipp not used anymore
  * Query for a document nested in an array
  *   const cursor = db.collection('inventory').find({
        'instock.qty': { $lte: 20 }
      });
  * */
  getArticlesInvitedForReviewing: async (ethereumAddress) => {
    const articleVersionIdObjects = await ReviewService.getReviewInvitations(ethereumAddress)
      .select('articleVersion -_id');
    const articles = await getArticleVersionsByIdObjects(articleVersionIdObjects)
      .populate({
        path: 'editorApprovedReviews'
      })
      .populate({
        path: 'communityReviews'
      });
    return getArticlesResponse(articles);
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
  getDraftsOfUser: async (userAddress) => {
    let drafts = await ArticleVersion.find({
      ownerAddress: userAddress,
      articleVersionState: ArticleVersionStates.DRAFT
    });
    if (!drafts) {
      errorThrower.noEntryFoundById('EthereumAddress');
    }
    return getDraftInfos(drafts);
  },

  getSubmittedAndFinishedDraftOfUser: async (userAddress) => {
    const drafts = await ArticleVersion.find({
      ownerAddress: userAddress,
      $or: [{articleVersionState: ArticleVersionState.FINISHED_DRAFT}, {articleVersionState: ArticleVersionState.SUBMITTED}]
    });
    return getDraftInfos(drafts);
  },

  updateDraftById: async (userAddress, articleVersionId, document) => {
    // error checking
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (articleVersion.articleVersionState !== ArticleVersionStates.DRAFT)
      errorThrower.notCorrectStatus(ArticleVersionStates.DRAFT, articleVersion.articleVersionState);
    if (articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

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
      errorThrower.notCorrectStatus(ArticleVersionStates.DRAFT, articleVersion.articleVersionState);
    if (articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

    articleVersion.articleHash = articleHash;
    articleVersion.articleVersionState = ArticleVersionStates.FINISHED_DRAFT;

    await articleVersion.save();
    return 'Successful finished draft of article-version';
  },

  revertToDraft: async (userAddress, articleVersionId) => {
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (articleVersion.articleVersionState !== ArticleVersionState.FINISHED_DRAFT) {
      errorThrower.notCorrectStatus(ArticleVersionState.FINISHED_DRAFT, articleVersion.articleVersionState);
    }
    if (articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress(userAddress);

    articleVersion.articleVersionState = ArticleVersionState.DRAFT;
    await articleVersion.save();
    return 'Articleversion ' + articleVersion._id + 'has reverted Status: '
      + ArticleVersionState.FINISHED_DRAFT + ' to ' + ArticleVersionState.DRAFT;
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
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionID);
    if (articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    return articleVersion;
  },


  changeArticleVersionState: async (articleHash, versionState) => {
    if (!(versionState in ArticleVersionState)) {
      let error = new Error('Internal error: Provided param "versionState" is not a actual ArticleVersionState');
      error.status = 500;
      throw error;
    }

    await ArticleVersion.findOneAndUpdate({articleHash: articleHash},
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
    draftInfos.push(draftInfo);
  });
  return draftInfos;
}