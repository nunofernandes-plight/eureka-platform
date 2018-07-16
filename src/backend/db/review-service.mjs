import mongoose from './mongoose';
import db from './db';
import reviewSchema from '../schemas/review.mjs';

const collectionName = 'reviews';
const Review = mongoose.model(collectionName, reviewSchema, collectionName);

export default {
  getAllReviews: () => {
    return db
      .collection(collectionName)
      .find()
      .toArray();
  },
  createReview: ({rating, text}) => {
    const review = new Review({rating: rating, text: text});
    return review.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new review on DB done');
    });
  }
};
