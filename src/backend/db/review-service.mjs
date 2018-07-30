import db from './db';
import Review from '../schema/review.mjs';

export default {
  getAllReviews: () => {
    return db
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
