import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import reviewService from '../db/review-service.mjs';
import accesController from '../controller/acess-controller.mjs';
import {getRelevantArticleData} from '../helpers/relevant-article-data.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
const router = express.Router();

router.use(accesController.loggedInOnly);

router.get(
  '/',
  asyncHandler(async () => {
    return reviewService.getAllReviews();
  })
);

router.get(
  '/invited',
  asyncHandler(async req => {
    let reviews = await reviewService.getReviewInvitations(req.session.passport.user.ethereumAddress);
    return getReviewsResponseArray(reviews);
  })
);

router.get(
  '/myreviews',
  asyncHandler(async req => {
    let reviews = await reviewService.getMyReviews(req.session.passport.user.ethereumAddress);
    return getReviewsResponseArray(reviews);
  })
);

router.get(
  '/handedin',
  asyncHandler(async () => {
    let reviews = await reviewService.getHandedInReviews();
    return getReviewsResponseArray(reviews);
  })
);

router.get(
  '/checkable',
  asyncHandler(async req => {
    let reviews = await reviewService.getHandedInReviewsAssignedTo(req.session.passport.user.ethereumAddress);
    return getReviewsResponseArray(reviews);
  })
);

router.get(
  '/:reviewId',
  asyncHandler(async req => {
    if (!req.params.reviewId) {
      errorThrower.missingParameter('reviewId');
    }
    const review = await reviewService.getReviewById(
      req.session.passport.user.ethereumAddress,
      req.params.reviewId
    );
    return getDetailedArticleAndReviewData(review);
  })
);


router.post(
  '/invite',
  asyncHandler(async req => {
    return reviewService.createReviewInvitation(
      req.body.reviewerAddress,
      req.body.articleHash,
      req.body.reviewType
    );
  })
);

/**
 *  Add an review including scoring and issues into an existing review object
 */
router.put(
  '/editorApproved',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    return await reviewService.addEditorApprovedReview(
      ethereumAddress,
      req.body.reviewId,
      req.body.reviewText,
      req.body.reviewHash,
      req.body.score1,
      req.body.score2,
      req.body.articleHasMajorIssues,
      req.body.articleHasMinorIssues);
  })
);

router.put(
  '/update',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    return await reviewService.updateReview(
      ethereumAddress,
      req.body._id,
      req.body.reviewText,
      req.body.reviewHash,
      req.body.score1,
      req.body.score2,
      req.body.articleHasMajorIssues,
      req.body.articleHasMinorIssues);
  })
);

router.put(
  '/community',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    return await reviewService.addNewCommunityReview(
      ethereumAddress,
      req.body.articleHash,
      req.body.reviewText,
      req.body.reviewHash,
      req.body.score1,
      req.body.score2,
      req.body.articleHasMajorIssues,
      req.body.articleHasMinorIssues);
  })
);

export default router;

const getReviewsResponseArray = (reviews) => {
  let reviewObjs = [];
  reviews.map(review => {
    reviewObjs.push(getRelevantReviewData(review));
  });
  return reviewObjs;
};

const getRelevantReviewData = review => {
  let obj = getRelevantArticleData(review.articleVersion.articleSubmission, review.articleVersion);
  obj.reviewId = review._id;
  obj.reviewHash = review.reviewHash;
  obj.reviewState = review.reviewState;
  obj.reviewType = review.reviewType;
  obj.articleHasMajorIssues = review.articleHasMajorIssues;
  obj.articleHasMinorIssues = review.articleHasMinorIssues;
  obj.stateTimestamp = review.stateTimestamp;
  obj.reviewerAddress = review.reviewerAddress;
  obj.score1 = review.reviewScore1;
  obj.score2 = review.reviewScore2;
  obj.reviewText = review.reviewText;

  return obj;
};

const getDetailedArticleAndReviewData = review => {
  return {
    article: review.articleVersion,
    review: review
  };
};