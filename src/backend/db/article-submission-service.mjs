import ArticleSubmission from '../schema/article-submission.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import articleVersionService from './article-version-service.mjs';
import ARTICLE_SUBMISSION_STATE from '../schema/article-submission-state-enum.mjs';
import User from '../schema/user.mjs';
import Roles from '../schema/roles-enum.mjs';
import {sleepSync} from '../../helpers/sleepSync.mjs';


export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({})
      .populate('articleVersions')
      .populate([
        {path: 'articleVersions.editorApprovedReviews'},
        {path: 'articleVersions.communityReviews'}
      ]);
  },

  getSubmissionIds: objects => {
    return objects.map(i => {
      return i._id;
    });
  },

  getUnassignedSubmissions: async (pageNumber, nPerPage) => {
    return await ArticleSubmission.find({
      editor: null,
      articleSubmissionState: 'OPEN'
    }).skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
      .limit( nPerPage )
      .populate('articleVersions')
      .populate([
        {path: 'articleVersions.editorApprovedReviews'},
        {path: 'articleVersions.communityReviews'}
      ]);
  },

  getAssignedSubmissions: async ethereumAddress => {
    // const submissions = await ArticleSubmission.find({editor: ethereumAddress, articleSubmissionState: {$ne: 'CLOSED'}}).populate('articleVersions');
    return await ArticleSubmission.find({
      editor: ethereumAddress,
      articleSubmissionState: {$ne: 'CLOSED'}
    })
      .populate('articleVersions')
      .populate([
        {path: 'articleVersions.editorApprovedReviews'},
        {path: 'articleVersions.communityReviews'}
      ]);
  },

  createSubmission: async ownerAddress => {
    // set user's role to AUTHOR once he creates the first draft
    const user = await User.findOne({ethereumAddress: ownerAddress});

    if (!user.roles.includes(Roles.AUTHOR)) {
      user.roles.push(Roles.AUTHOR);
      await user.save();
    }

    // create article submission
    const submission = new ArticleSubmission({ownerAddress: ownerAddress});

    // create first article version
    const firstArticle = await articleVersionService.createArticleVersion(
      ownerAddress,
      submission._id
    );
    if (!firstArticle) errorThrower.noCreationOfEntry('Article Version');

    // save article version within submission
    submission.articleVersions.push(firstArticle._id);

    const dbSubmission = await submission.save();
    if (!dbSubmission) errorThrower.noCreationOfEntry('Article-Submission');

    const response = {
      articleVersionId: firstArticle._id,
      articleSubmissionId: submission._id
    };
    return response;
  },

  /**
   * Get all the article-submissions of an user
   * @param userAddress
   * @returns {Promise<*>}
   */
  getSubmissionsOfUser: async userAddress => {
    const submissions = await ArticleSubmission.find({
      ownerAddress: userAddress
    }).populate('articleVersions');
    if (!submissions) errorThrower.noEntryFoundById('EthereumAddress');
    return submissions;
  },

  /**
   * Get one submission by DB-ID
   * @param _submissionId
   * @returns {Promise<Query|void|*|ThenPromise<Object>|Promise<TSchema | null>|Promise>}
   */
  getSubmissionById: async _submissionId => {
    return ArticleSubmission.findById(_submissionId);
  },

  /**
   * Gets the submission, which contains an article-version holding the
   * articleHash provided as param with in it.
   * @param scSubmissionId
   * @param articleHash
   * @param articleUrl
   * @returns {Promise<void>}
   */
  updateSubmissionStartByArticleHash: async (
    scSubmissionId,
    articleHash,
    articleUrl
  ) => {
    let articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    });

    //error checking
    if (!articleVersion) errorThrower.noEntryFoundById(articleHash);
    if (
      articleVersion.articleVersionState !== ArticleVersionState.FINISHED_DRAFT
    ) {
      console.log('THIS IS HAPPENING: ' + articleVersion.articleVersionState);
      errorThrower.notCorrectStatus(
        ArticleVersionState.FINISHED_DRAFT,
        articleVersion.articleVersionState
      );
    }

    articleVersion.articleVersionState = ArticleVersionState.SUBMITTED;
    await articleVersion.save();

    let articleSubmission = await ArticleSubmission.findOne({
      articleVersions: articleVersion._id
    });
    if (!articleSubmission) errorThrower.noEntryFoundById(articleVersion._id);
    articleSubmission.scSubmissionID = scSubmissionId;
    articleSubmission.articleUrl = articleUrl;
    articleSubmission.articleSubmissionState = ARTICLE_SUBMISSION_STATE.OPEN;
    articleSubmission = await articleSubmission.save();
    return articleSubmission;
  },

  deleteSubmissionById: async (userAddress, submissionId) => {
    const articleSubmission = await ArticleSubmission.findOneAndDelete({
      scSubmissionID: submissionId
    });
    if (!articleSubmission) errorThrower.noEntryFoundById(submissionId);
    if (articleSubmission.ownerAddress !== userAddress)
      errorThrower.notCorrectEthereumAddress();

    // delete all article version related to the article submission
    await Promise.all(
      articleSubmission.articleVersions.map(async articleVersionId => {
        await ArticleVersion.findByIdAndDelete(articleVersionId);
      })
    );

    //delete article-submission
    await articleSubmission.remove();
    return 'Successful deletion of Submission with ID' + submissionId;
  },

  /**
   * Deletes the whole submission by the articleVersion Id it contains
   * @param userAddress
   * @param draftId
   * @returns {Promise<void>}
   */
  deleteSubmissionByDraftId: async (userAddress, articleVersionID) => {
    const articleSubmission = await ArticleSubmission.findOne({
      articleVersions: articleVersionID
    });
    if (!articleSubmission) errorThrower.noEntryFoundById(articleVersionID);
    if (articleSubmission.ownerAddress !== userAddress)
      errorThrower.notCorrectEthereumAddress();

    // delete all article version related to the article submission
    await Promise.all(
      articleSubmission.articleVersions.map(async articleVersionId => {
        await ArticleVersion.findByIdAndDelete(articleVersionId);
      })
    );
    await articleSubmission.remove();
  },
  /**
   * Add the editor to the submission given by the ID
   * @param _submissionId
   * @param _editor
   * @returns {Promise<void>}
   */
  updateEditorToSubmission: async (_submissionId, _editor) => {
    ArticleSubmission.findOneAndUpdate(
      {scSubmissionID: _submissionId},
      {
        editor: _editor,
        articleSubmissionState: ARTICLE_SUBMISSION_STATE.EDITOR_ASSIGNED
      },
      (err, submission) => {
        if (err) throw err;
        else {
          console.log(
            'Submission ' + submission._id + ' has got the editor ' + _editor
          );
          return submission;
        }
      }
    );
  },

  removeEditorFromSubmission: async _submissionId => {
    ArticleSubmission.findOneAndUpdate(
      {scSubmissionID: _submissionId},
      {
        editor: undefined,
        articleSubmissionState: ARTICLE_SUBMISSION_STATE.OPEN
      },
      (err, submission) => {
        if (err) throw err;
        else {
          console.log(
            'Submission ' + submission._id + ' has the editor removed'
          );
          return submission;
        }
      }
    );
  },
  /**
   * Push a new article version to the given submission
   * @param _submissionId
   * @param _articleHash
   * @param _articleUrl
   * @returns {Promise<*>}
   */
  submitArticleVersion: async (_submissionId, _articleHash, _articleUrl) => {
    let submission = await ArticleSubmission.findById(_submissionId);
    if (!submission) {
      errorThrower.noEntryFoundById('_submissionId');
    }

    const articleVersion = new ArticleVersion({
      submissionId: _submissionId,
      articleHash: _articleHash,
      articleUrl: _articleUrl
    });

    submission.articleVersions.push(articleVersion);
    await submission.save();
    return submission;
  },

  pushReviewIntoArticleVersion: async (_submissionId, _articleHash, review) => {
    let submission = await ArticleSubmission.findById(_submissionId);
    if (!submission) {
      errorThrower.noEntryFoundById('_submissionId');
    }

    //get position within article-version array
    const articleVersionPosition = submission.articleVersions.findIndex(
      entry => {
        return entry.articleHash === _articleHash;
      }
    );

    submission.articleVersions[
      articleVersionPosition
    ].editorApprovedReviews.push(review);

    return await submission.save();
  }
};
