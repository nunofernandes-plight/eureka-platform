import mongoose from 'mongoose';
import {articleVersionSchema} from './article-version-state.mjs';

/**
 * ArticleSubmission for an article on the eureka platform
 */
export const articleSubmissionSchema = mongoose.Schema(
  {
    _id: {
      type: Number
    },
    ownerAddress: {
      type: String,
      required: true
    },
    editor: {
      type: String
    },
    articleVersions: [articleVersionSchema]
  },
  {collection: 'articleSubmissions'}
);

const ArticleSubmission = mongoose.model('ArticleSubmission', articleSubmissionSchema, 'articleSubmissions');
export default ArticleSubmission;