import mongoose from 'mongoose';
import ReviewState from './review-state-enum.mjs';

export const reviewSchema = mongoose.Schema(
  {
    reviewState: {
      type: String,
      enum: Object.values(ReviewState),
      default: ReviewState.INVITED
    },
    stateTimestamp: {
      type: String,
      required: true
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
    hasMajorIssues: {
      type: Boolean,
      default: false
    },
    hasMinorIssues: {
      type: Boolean,
      default: false
    }
  },
  {collection: 'editorApprovedReviews'}
);

const Review = mongoose.model('Review', reviewSchema, 'editorApprovedReviews');
export default Review;
