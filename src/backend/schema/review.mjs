import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    rating: Number,
    text: String
  },
  {collection: 'reviews'}
);

const Review = mongoose.model('Review', reviewSchema, 'reviews');
export default Review;
