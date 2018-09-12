import ArticleSubmission from '../schema/article-submission.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import articleVersionService from './article-version-service.mjs';

export default {
  getAllSubmissions: () => {
    return ArticleSubmission.find({}).populate('articleVersions');
  },

  getUnassignedSubmissions: async () => {

    const submissions = await ArticleSubmission.find({editor: null}).populate('articleVersions');
    let resSubmissions = [];
    submissions.map(submission => {
      let resSubmission = {};
      let lastArticleVersion = submission.articleVersions[submission.articleVersions.length - 1];
      resSubmission._id = lastArticleVersion._id;
      resSubmission.articleHash = lastArticleVersion.articleHash;
      resSubmission.articleVersionState = lastArticleVersion.articleVersionState;
      resSubmission.ownerAddress = lastArticleVersion.ownerAddress;
      resSubmission.updatedAt = lastArticleVersion.updatedAt;

      resSubmission.title = lastArticleVersion.document.title;
      resSubmission.authors = lastArticleVersion.document.authors;
      resSubmission.abstract = lastArticleVersion.document.abstract;
      resSubmission.figure = lastArticleVersion.document.figure;

      resSubmissions.push(resSubmission);
      });
    return resSubmissions;
  },

  createSubmission: async (ownerAddress) => {
    // create first article version
    const firstArticle = await articleVersionService.createArticleVersion(ownerAddress);
    if (!firstArticle) errorThrower.noCreationOfEntry('Article Version');

    // create article submission and save article version within it
    const submission = new ArticleSubmission(
      {ownerAddress: ownerAddress});
    submission.articleVersions.push(firstArticle._id);

    const dbSubmission = await submission.save();
    if(!dbSubmission) errorThrower.noCreationOfEntry('Article-Submission');

    const  response = {
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
  getSubmissionsOfUser: async (userAddress) => {
    const submissions = await ArticleSubmission.find({
      ownerAddress: userAddress
    }).populate('articleVersions');
    if(!submissions) errorThrower.noEntryFoundById('EthereumAddress');
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
  updateSubmissionStartByArticleHash: async (scSubmissionId, articleHash, articleUrl) => {
    let articleVersion = await ArticleVersion.findOne({articleHash: articleHash});

    //error checking
    if(!articleVersion) errorThrower.noEntryFoundById(articleHash);
    if(articleVersion.articleVersionState !== ArticleVersionState.FINISHED_DRAFT)
      errorThrower.notCorrectStatus(ArticleVersionState.FINISHED_DRAFT, articleVersion.articleVersionState);

    articleVersion.articleVersionState = ArticleVersionState.SUBMITTED;
    await articleVersion.save();

    let articleSubmission = await ArticleSubmission.findOne({'articleVersions': articleVersion._id});
    if(!articleSubmission) errorThrower.noEntryFoundById(articleVersion._id);
    articleSubmission.scSubmissionID = scSubmissionId;
    articleSubmission.articleUrl = articleUrl;
    articleSubmission = await articleSubmission.save();
    return articleSubmission;
  },


  deleteSubmissionById: async (userAddress, submissionId) => {
    const articleSubmission = await ArticleSubmission.findOneAndDelete({scSubmissionID: submissionId});
    if(!articleSubmission) errorThrower.noEntryFoundById(submissionId);
    if(articleSubmission.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

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
    const articleSubmission = await ArticleSubmission.findOne({'articleVersions': articleVersionID});
    if(!articleSubmission) errorThrower.noEntryFoundById(articleVersionID);
    if(articleSubmission.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

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
    ArticleSubmission.findOneAndUpdate({scSubmissionID: _submissionId},
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
    ArticleSubmission.findOneAndUpdate({scSubmissionID: _submissionId},
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

  pushReviewIntoArticleVersion: async (_submissionId, _articleHash, review) => {
    let submission = await ArticleSubmission.findById(_submissionId);
    if (!submission) {
      errorThrower.noEntryFoundById('_submissionId');
    }

    //get position within article-version array
    const articleVersionPosition = submission.articleVersions.findIndex((entry) => {
      return entry.articleHash === _articleHash;
    });

    submission.articleVersions[articleVersionPosition].editorApprovedReviews.push(review);

    return await submission.save();
  }
};