import Review from '../schema/review.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

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
  getReviewById: async (userAddress, reviewId) => {
    const review = await Review.findById(reviewId);
    if(!review) errorThrower.noEntryFoundById(reviewId);
    if(review.reviewerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    return review;
  }
};
