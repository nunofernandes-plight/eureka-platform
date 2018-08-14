import mongoose from 'mongoose';

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
    editorChecked: {
      type: Boolean,
      default: false
    }

  },
  {collection: 'articleVersion'}
);

const ArticleVersions = mongoose.model('ArticleVersion', articleVersionSchema, 'articleVersions');
export default ArticleVersions;