import ArticleSubmission from '../schema/article-submission.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import userService from './user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({});
  },
  createSubmission: async (submissionId, ownerAddress) => {
    const submission = new ArticleSubmission(
      {_id: submissionId, ownerAddress: ownerAddress});

    await submission.save();
    await userService.addArticleSubmission(ownerAddress, submissionId);
    return submissionId;
  },

  /**
   * Get one submission by ID
   * @param _submissionId
   * @returns {Promise<Query|void|*|ThenPromise<Object>|Promise<TSchema | null>|Promise>}
   */
  getSubmissionById: async _submissionId => {
    return ArticleSubmission.findById(_submissionId);
  },


  /**
   * Add the editor to the submission given by the ID
   * @param _submissionId
   * @param _editor
   * @returns {Promise<void>}
   */
  updateEditorToSubmission: async (_submissionId, _editor) => {
    ArticleSubmission.findByIdAndUpdate(_submissionId,
      {
        editor: _editor
      }, (err, submission) => {
        if (err) throw err;
        else {
          console.log('Submission ' + submission._id + ' has got the editor ' + _editor);
          return submission;
        }
      });
  },

  removeEditorFromSubmission: async (_submissionId) => {
    ArticleSubmission.findByIdAndUpdate(_submissionId,
      {
        $unset: {
          editor: 1
        }
      }, (err, submission) => {
        if (err) throw err;
        else {
          console.log('Submission ' + submission._id + ' has the editor removed');
          return submission;
        }
      });
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

  changeArticleVersionState: async (_submissionId, _articleHash, versionState) => {
    if (!(versionState in ArticleVersionState)) {
      let error = new Error('Internal error: Provided param "versionState" is not a actual ArticleVersionState');
      error.status = 500;
      throw error;
    }
    let submission = await ArticleSubmission.findById(_submissionId);
    if (!submission) {
      errorThrower.noEntryFoundById('_submissionId');
    }

    //get position within article-version array
    const articleVersionPosition = submission.articleVersions.findIndex((entry) => {
      return entry.articleHash === _articleHash;
    });

    submission.articleVersions[articleVersionPosition].articleVersionState = versionState;
    return await submission.save();
  },

  pushReviewIntoArticleVersion: async (_submissionId, _articleHash, review) => {
    let submission = await ArticleSubmission.findById(_submissionId);
    if (!submission) {
      errorThrower.noEntryFoundById('_submissionId');
    }

    //get position within article-version array
    const articleVersionPosition = submission.articleVersions.findIndex( (entry) => {
      return entry.articleHash === _articleHash;
    });

    submission.articleVersions[articleVersionPosition].reviews.push(review);

    return await submission.save();
  }
};