import mongoose from 'mongoose';
import ArticleVersionState from './article-version-state-enum.mjs';

/**
 * ArticleVersion for an submission on the eureka platform
 */
export const articleVersionSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
    stateTimestamp: {
      type: String,
    },
    document: {},
    timestamp: {
      type: Date
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
    },
    articleSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleSubmission'
    },
    editorApprovedReviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }],
    communityReviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }],
    linkedArticles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleVersion'
    }]
  },
  {
    collection: 'articleVersions',
    timestamps: true
  }
);

const ArticleVersion = mongoose.model('ArticleVersion', articleVersionSchema, 'articleVersions');
export default ArticleVersion;