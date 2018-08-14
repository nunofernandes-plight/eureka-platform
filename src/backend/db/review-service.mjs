import Review from '../schema/review.mjs';

export default {
  getAllReviews: () => {
    return Review.find({});
  },
  createReview: async (submissionId, articleHash, stateTimestamp) => {
    const review = new Review({submissionId, articleHash, stateTimestamp});
    return review.save(err => {
      if (err) return console.error(err);
      console.log('Created new review on DB done');
    });
  },
  createReviewAndReturn: async (submissionId, articleHash, stateTimestamp) => {
    return new Review({submissionId, articleHash, stateTimestamp});
  }
};
