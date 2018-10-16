import mongoose from 'mongoose';

export const annotationSchema = mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    articleVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleVersion'
    },
    owner: {
      type: String
    },
    field: {
      type: String
    },
    text: {
      type: String
    },
    date: {
      type: String
    },
    isMajorIssue: {
      type: Boolean
    }
  },
  {collection: 'annotations'}
);

const Annotation = mongoose.model('Annotation', annotationSchema, 'annotations');
export default Annotation;
