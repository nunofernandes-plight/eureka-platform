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
      required: true
    }
  },
  {collection: 'reviews'}
);

const Review = mongoose.model('Review', reviewSchema, 'reviews');
export default Review;
