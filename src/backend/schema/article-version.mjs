import mongoose from 'mongoose';
import ArticleVersionState from './article-version-state-enum.mjs';
import {reviewSchema} from './review.mjs'
/**
 * ArticleVersion for an submission on the eureka platform
 */
export const articleVersionSchema = mongoose.Schema(
  {
    submissionId: {
      type: Number,
      required: true
    },
    articleHash: {
      type: String,
      required: true
    },
    articleUrl: {
      type: String,
      required: true
    },
    articleVersionState: {
      type: String,
      enum: Object.values(ArticleVersionState),
      default: ArticleVersionState.SUBMITTED
    },
    reviews: [
      reviewSchema
    ]
  },
  {collection: 'articleVersionState'}
);

const ArticleVersions = mongoose.model('ArticleVersion', articleVersionSchema, 'articleVersions');
export default ArticleVersions;