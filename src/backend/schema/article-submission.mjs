import mongoose from 'mongoose';
import ArticleSubmissionState from './article-submission-state-enum.mjs';
/**
 * ArticleSubmission for an article on the eureka platform
 */
export const articleSubmissionSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
    scSubmissionID: {
      type: Number
    },
    stateTimestamp: {
      type: String,
    },
    articleSubmissionState: {
      type: String,
      enum: Object.values(ArticleSubmissionState),
      default: ArticleSubmissionState.DRAFT
    },
    editor: {
      type: String
    },
    articleVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArticleVersion'
      }
    ]
  },
  {collection: 'articleSubmissions'}
);

const ArticleSubmission = mongoose.model('ArticleSubmission', articleSubmissionSchema, 'articleSubmissions');
export default ArticleSubmission;