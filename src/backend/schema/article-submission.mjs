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
  {collection: 'submissions'}
);

const ArticleSubmission = mongoose.model('ArticleSubmission', submissionSchema, 'submissions');
export default ArticleSubmission;