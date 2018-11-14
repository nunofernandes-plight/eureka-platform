import Review from '../schema/review.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import articleVersionService from './article-version-service.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';
import {getIds} from '../helpers/get-array-of-ids.mjs';

export default {
  getAllReviews: () => {
    return Review.find({})
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getReviewsFromArticle: (articleVersion) => {
    return Review.find({articleVersion})
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getReviewInvitations: async (address) => {
    return await Review.find({
      reviewerAddress: address,
      reviewState: {$in: ['INVITED', 'INVITATION_ACCEPTED']}
    })
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getMyReviews: (address) => {
    return Review.find({
      reviewerAddress: address,
      reviewState: {$in: ['HANDED_IN_DB', 'HANDED_IN_SC', 'DECLINED', 'ACCEPTED']}
    })
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getReviewsByState: async (reviewState) => {
    if(!(reviewState in ReviewState)) errorThrower.notCorrectStatus('any of Object ReviewState', reviewState);

    return await Review.find({
      reviewState: {$in: [reviewState]}
    });
  },

  getHandedInReviews: async () => {
    return await Review.find({
      reviewState: {$in: ['HANDED_IN_SC']}
    })
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getHandedInReviewsAssignedTo: async (ethereumAddress) => {
    let articles = await articleVersionService.getArticlesAssignedTo(
      ethereumAddress,
      [ARTICLE_VERSION_STATE.REVIEWERS_INVITED, ARTICLE_VERSION_STATE.EDITOR_CHECKED]
    );
    const articleIds = getIds(articles);

    return await Review.find({
      reviewState: {$in: ['HANDED_IN_SC']},
      articleVersion: {$in: articleIds}
    })
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getArticlesWithEnoughAcceptedReviews: async (reviewType, minNumberOfReviews) => {
    return await Review.aggregate([
      {
        $match: {
          reviewState: 'ACCEPTED',
          reviewType: reviewType
        }
      },
      {$group: {_id: '$articleVersion', count: {$sum: 1}}},
      {$match: {count: {$gte: minNumberOfReviews}}}
    ]);
  },

  createReview: async (submissionId, articleHash, stateTimestamp) => {
    const review = new Review({submissionId, articleHash, stateTimestamp});
    return review.save(err => {
      if (err) throw err;
      console.log('Created new review on DB done');
    });
  },

  getReviewById: async (userAddress, reviewId) => {
    return await Review.findById(reviewId)
      .populate({
        path: 'articleVersion',
        populate: [
          {path: 'articleSubmission'},
          {path: 'editorApprovedReviews'},
          {path: 'communityReviews'}]
      });
  },

  getReviewByReviewHash: async (reviewHash) => {
    const review = await Review.findOne({reviewHash: reviewHash});
    if (!review) errorThrower.noEntryFoundByParameters('reviewHash');
    return review;
  },


  getArticleVersionIds: idObjects => {
    return idObjects.map(i => {
      return i.articleVersion;
    });
  },

  // TODO: addReviewInvitation
  // TODO: acceptedReviewInvitation

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
    review.articleHasMajorIssues = articleHasMajorIssues;
    review.articleHasMinorIssues = articleHasMinorIssues;
    review.reviewState = ReviewState.HANDED_IN_DB;
    await review.save();
    return 'Added editor-approved review into DB.';
  },

  updateReview: async (userAddress, reviewId, reviewText, reviewHash, score1, score2, articleHasMajorIssues, articleHasMinorIssues) => {
    const review = await Review.findById(reviewId);
    if (!review) errorThrower.noEntryFoundById(reviewId);
    if (review.reviewerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    if (review.reviewState !== ReviewState.HANDED_IN_DB) {
      errorThrower.notCorrectStatus(
        [ReviewState.HANDED_IN_DB], review.reviewState);
    }

    review.reviewHash = reviewHash;
    review.reviewText = reviewText;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    review.articleHasMajorIssues = articleHasMajorIssues;
    review.articleHasMinorIssues = articleHasMinorIssues;
    review.reviewState = ReviewState.HANDED_IN_DB;
    await review.save();
    return 'saved editor-approved review to DB.';
  },

  updateEditorApprovedReviewFromSC: async (articleHash, reviewHash, reviewerAddress, stateTimestamp, articleHasMajorIssues, articleHasMinorIssues, score1, score2) => {
    let articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    });

    let review = await Review.findOne({
      articleVersion: articleVersion._id,
      reviewHash: reviewHash,
      reviewerAddress: reviewerAddress
    });
    if (!review) errorThrower.noEntryFoundById(reviewHash);
    review.reviewState = ReviewState.HANDED_IN_SC;
    review.stateTimestamp = stateTimestamp;
    // web3 event listener returns false as null
    review.articleHasMajorIssues = !!articleHasMajorIssues;
    review.articleHasMinorIssues = !!articleHasMinorIssues;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    await review.save();
    return 'Updated editor-approved review according to SC: ' + reviewHash;
  },

  updateReviewByReviewHash: async (oldReviewHash, newReviewHash, stateTimestamp, articleHasMajorIssues, articleHasMinorIssues, score1, score2) => {
    let review = await Review.findOne({
      reviewHash: oldReviewHash
    });
    if (!review) errorThrower.noEntryFoundByParameters('oldReviewHash');

    review.reviewHash = newReviewHash;
    review.stateTimestamp = stateTimestamp;
    review.articleHasMajorIssues = articleHasMajorIssues;
    review.articleHasMinorIssues = articleHasMinorIssues;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    await review.save();
    return 'Updated review with ID: ' + review._id;
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
    if (!articleVersion) errorThrower.noEntryFoundById(articleHash);

    const review = new Review({
      reviewerAddress: userAddress,
      reviewText: reviewText,
      reviewHash: reviewHash,
      reviewScore1: score1,
      reviewScore2: score2,
      articleHasMajorIssues: articleHasMajorIssues,
      articleHasMinorIssues: articleHasMinorIssues,
      reviewState: ReviewState.HANDED_IN_DB,
      stateTimestamp: new Date().getTime(),
      articleVersion: articleVersion._id
    });
    await review.save();
    articleVersion.communityReviews.push(review._id);
    await articleVersion.save();
    return review;
  },
  updateCommunityReviewFromSC: async (articleHash, reviewHash, reviewerAddress, stateTimestamp, articleHasMajorIssues, articleHasMinorIssues, score1, score2) => {
    let articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    });

    let review = await Review.findOne({
      articleVersion: articleVersion._id,
      reviewHash: reviewHash,
      reviewerAddress: reviewerAddress
    });

    if (!review) errorThrower.noEntryFoundById(reviewHash);
    review.reviewState = ReviewState.HANDED_IN_SC;
    review.stateTimestamp = stateTimestamp;
    // web3 event listener returns false as null
    review.articleHasMajorIssues = !!articleHasMajorIssues;
    review.articleHasMinorIssues = !!articleHasMinorIssues;
    review.reviewScore1 = score1;
    review.reviewScore2 = score2;
    await review.save();
    return 'Updated community review according to SC: ' + reviewHash;
  },

  acceptReview: async (articleHash, reviewerAddress, stateTimestamp) => {
    const articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    }).populate('editorApprovedReviews');

    const reviewId = articleVersion.editorApprovedReviews.find((review) => {
      return review.reviewerAddress === reviewerAddress;
    });

    let review = await Review.findById(reviewId);
    review.reviewState = ReviewState.ACCEPTED;
    review.stateTimestamp = stateTimestamp;
    await review.save();
    return 'Acception of review ' + reviewId;
  },

  declineReview: async (articleHash, reviewerAddress, stateTimestamp) => {
    const articleVersion = await ArticleVersion.findOne({
      articleHash: articleHash
    }).populate('editorApprovedReviews');

    const reviewId = articleVersion.editorApprovedReviews.find((review) => {
      return review.reviewerAddress === reviewerAddress;
    });


    let review = await Review.findById(reviewId);
    review.reviewState = ReviewState.DECLINED;
    review.stateTimestamp = stateTimestamp;
    await review.save();

    return 'Decline of review ' + reviewId;
  }
};