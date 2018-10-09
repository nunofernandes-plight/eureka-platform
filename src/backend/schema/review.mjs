import mongoose from 'mongoose';
import ReviewState from './review-state-enum.mjs';
import ReviewType from './review-type-enum.mjs';

export const reviewSchema = mongoose.Schema(
  {
    reviewState: {
      type: String,
      enum: Object.values(ReviewState),
      default: ReviewState.INVITED
    },
    reviewType: {
      type: String,
      enum: Object.values(ReviewType),
      default: ReviewType.COMMUNITY_REVIEW
    },
    stateTimestamp: {
      type: String,
      required: true
    },
    articleVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleVersion'
    },
    reviewerAddress: {
      type: String,
    },
    reviewHash: {
      type: String,
    },
    reviewText: {
      type: String,
    },
    reviewScore1: {
      type: Number
    },
    reviewScore2: {
      type: Number
    },
    articleHasMajorIssues: {
      type: Boolean,
      default: false
    },
    articleHasMinorIssues: {
      type: Boolean,
      default: false
    }
  },
  {collection: 'reviews'}
);

const Review = mongoose.model('Review', reviewSchema, 'reviews');
export default Review;
