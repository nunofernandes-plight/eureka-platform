import mongoose from 'mongoose';
import {articleVersionSchema} from './article-version.mjs';

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