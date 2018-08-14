import mongoose from 'mongoose';
import ReviewState from './review-state-enum.mjs';

export const reviewSchema = mongoose.Schema(
  {
    //submission it belongs to
    submissionId: {
      type: Number,
      required: true
    },
    // article hash it belongs to
    articleHash: {
      type: String,
      required: true
    },
    reviewState: {
      type: String,
      enum: Object.values(ReviewState),
      default: ReviewState.INVITED
    },
    stateTimestamp: {
      type: String,
      required: true
    }
  },
  {collection: 'reviews'}
);

const Review = mongoose.model('Review', reviewSchema, 'reviews');
export default Review;
