import Review from '../schema/review.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  getAllReviews: () => {
    return Review.find({});
  },
  createReview: async (submissionId, articleHash, stateTimestamp) => {
    const review = new Review({submissionId, articleHash, stateTimestamp});
    return review.save(err => {
      if (err) throw err;
      console.log('Created new review on DB done');
    });
  },
  getReviewById: async (userAddress, reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) errorThrower.noEntryFoundById(reviewId);
    if (review.reviewerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    return review;
  },

  addEditorApprovedReview: async (userAddress, reviewId, reviewText, reviewHash,
    score1, score2, articleHasMajorIssues, articleHasMinorIssues) => {
    const review = await Review.findById(reviewId);
    if (!review) errorThrower.noEntryFoundById(reviewId);
    if (review.reviewerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

    review.reviewHash = reviewHash;
    review.reviewText = reviewText;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    review.hasMajorIssues= articleHasMajorIssues;
    review.hasMinorIssues = articleHasMinorIssues;
    await review.save();
    return 'Added editor-approved review into DB.';
  }
};
