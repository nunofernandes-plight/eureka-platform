import Review from '../schema/review.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import ArticleVersion from '../schema/article-version.mjs';

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

  /**
   * Frontend sends the data of an review right
   * before he submits the editorApprovedReviews hash into the SC
   * @param userAddress
   * @param reviewId
   * @param reviewText
   * @param reviewHash
   * @param score1
   * @param score2
   * @param articleHasMajorIssues
   * @param articleHasMinorIssues
   * @returns {Promise<string>}
   */
  addEditorApprovedReview: async (userAddress, reviewId, reviewText, reviewHash, score1, score2, articleHasMajorIssues, articleHasMinorIssues) => {
    const review = await Review.findById(reviewId);
    if (!review) errorThrower.noEntryFoundById(reviewId);
    if (review.reviewerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    if (review.reviewState !== ReviewState.INVITED &&
      review.reviewState !== ReviewState.INVITATION_ACCEPTED) {
      errorThrower.notCorrectStatus(
        [ReviewState.INVITED, ReviewState.INVITATION_ACCEPTED], review.reviewState);
    }

    review.reviewHash = reviewHash;
    review.reviewText = reviewText;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    review.hasMajorIssues = articleHasMajorIssues;
    review.hasMinorIssues = articleHasMinorIssues;
    review.reviewState = ReviewState.HANDED_IN_DB;
    await review.save();
    return 'Added editor-approved review into DB.';
  },

  updateEditorApprovedReviewFromSC: async (reviewHash, stateTimestamp, articleHasMajorIssues, articleHasMinorIssues, score1, score2) => {
    let review = await Review.findOne({reviewHash: reviewHash});
    if (!review) errorThrower.noEntryFoundById(reviewHash);
    review.reviewState = ReviewState.HANDED_IN_SC;
    review.stateTimestamp = stateTimestamp;
    review.hasMajorIssues = articleHasMajorIssues;
    review.hasMinorIssues = articleHasMinorIssues;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    await review.save();
    return 'Updated editor-approved review according to SC: ' + reviewHash;
  },

  /**
   * Frontend sends the data of an review right
   * before he submits the communityReviews hash into the SC
   * @param userAddress
   * @param reviewId
   * @param reviewText
   * @param reviewHash
   * @param score1
   * @param score2
   * @param articleHasMajorIssues
   * @param articleHasMinorIssues
   * @returns {Promise<void>}
   */
  addNewCommunitydReview: async (userAddress, articleHash, reviewText, reviewHash, score1, score2, articleHasMajorIssues, articleHasMinorIssues) => {
    let articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    });
    if(!articleVersion) errorThrower.noEntryFoundById(articleHash);

    const review = new Review({
      reviewerAddress: userAddress,
      reviewText: reviewText,
      reviewHash: reviewHash,
      reviewScore1: score1,
      reviewScore2: score2,
      hasMajorIssues: articleHasMajorIssues,
      hasMinorIssues: articleHasMinorIssues,
      reviewState: ReviewState.HANDED_IN_DB,
      stateTimestamp: new Date().getTime()
    });
    await review.save();
    articleVersion.communityReviews.push(review._id);
    await articleVersion.save();
    return review;
  },
  updateCommunityReviewFromSC: async (reviewHash, stateTimestamp, articleHasMajorIssues, articleHasMinorIssues, score1, score2) => {
    let review = await Review.findOne({reviewHash: reviewHash});

    if (!review) errorThrower.noEntryFoundById(reviewHash);
    review.reviewState = ReviewState.HANDED_IN_SC;
    review.stateTimestamp = stateTimestamp;
    review.hasMajorIssues = articleHasMajorIssues;
    review.hasMinorIssues = articleHasMinorIssues;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    await review.save();

    console.log('WORKING !!!! COMMUNITY');
    console.log(await Review.findById(review._id));
    return 'Updated community review according to SC: ' + reviewHash;
  },

}
};
