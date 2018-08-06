import mongoose from 'mongoose';

/**
 * ArticleSubmission for an article on the eureka platform
 */
export const submissionSchema = mongoose.Schema(
  {
    _id: {
      type: Number
    },
    ownerAddress: {
      type: String,
      required: true
    },
  },
  {collection: 'articleSubmissions'}
);

const ArticleSubmission = mongoose.model('ArticleSubmission', submissionSchema, 'articleSubmissions');
export default ArticleSubmission;