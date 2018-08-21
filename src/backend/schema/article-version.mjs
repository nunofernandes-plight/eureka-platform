import mongoose from 'mongoose';
import ArticleVersionState from './article-version-state-enum.mjs';
import {reviewSchema} from './review.mjs';

/**
 * ArticleVersion for an submission on the eureka platform
 */
export const articleVersionSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
    document: {},
    timestamp: {
      type: Number
    },
    articleHash: {
      type: String
    },
    articleUrl: {
      type: String
    },
    articleVersionState: {
      type: String,
      enum: Object.values(ArticleVersionState),
      default: ArticleVersionState.DRAFT
    }
    // reviews: [
    //   reviewSchema
    // ]
  },
  {
    collection: 'articleVersionState',
    timestamps: true
  }
);

const ArticleVersion = mongoose.model('ArticleVersion', articleVersionSchema, 'articleVersions');
export default ArticleVersion;