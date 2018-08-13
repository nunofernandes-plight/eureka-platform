import ArticleSubmission from '../schema/article-submission.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import userService from './user-service.mjs';

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
  addEditorToSubmission: async (_submissionId, _editor) => {
    ArticleSubmission.findByIdAndUpdate(_submissionId,
      {
        $addToSet: {
          editor: _editor
        }
      }, (err, submission) => {
        if (err) throw err;
        else {
          console.log('Submission ' + submission._id + ' has got the editor ' + _editor);
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
    let submission = await this.getSubmissionById(_submissionId);
    if (!submission) {
      let error = new Error('No Article-Submission with the given submission Id found');
      error.status = 400;
      throw error;
    }

    const articleVersion = new ArticleVersion({
      submissionId: _submissionId,
      articleHash: _articleHash,
      articleUrl: _articleUrl
    });

    submission.articleVersions.push(articleVersion);
    await submission.save();
    return submission;
  }
};