import mongoose from 'mongoose';
import ReviewState from './review-state-enum.mjs';

const reviewSchema = mongoose.Schema(
  {
    //submission it belongs to
    submissionId: {
      type: Number,
      required: true
    },
    reviewState: {
      type: String,
      enum: Object.values(ReviewState),
      default: ReviewState.NOT_EXISTING
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
