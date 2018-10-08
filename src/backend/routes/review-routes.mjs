import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import reviewService from '../db/review-service.mjs';
import accesController from '../controller/acess-controller.mjs';
import {getRelevantArticleData} from '../helpers/relevant-article-data.mjs';
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
    return getRelevantReviewData(reviews);
  })
);

router.get(
  '/myreviews',
  asyncHandler(async req => {
    let reviews = await reviewService.getMyReviews(req.session.passport.user.ethereumAddress);
    return getRelevantReviewData(reviews);
  })
);

//
// router.post(
//   '/',
//   asyncHandler(async req => {
//     return reviewService.createReview(req.body);
//   })
// );

/**
 *  Add an review including scoring and issues into an existing review object
 */
router.put(
  '/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    return await reviewService.addEditorApprovedReview(ethereumAddress,
      req.body.reviewId,
      req.body.reviewText,
      req.body.reviewHash,
      req.body.score1,
      req.body.score2,
      req.body.articleHasMajorIssues,
      req.body.articleHasMinorIssues);
  })
);

export default router;

const getRelevantReviewData = (reviews) => {
  let reviewObjs = [];
  reviews.map(review => {
    let obj = getRelevantArticleData(review.articleVersion.articleSubmission, review.articleVersion);
    obj.reviewState = review.reviewState;
    obj.reviewType = review.reviewType;
    obj.hasMajorIssues = review.hasMajorIssues;
    obj.hasMinorIssues = review.hasMinorIssues;
    obj.reviewId = review._id;
    obj.stateTimestamp = review.stateTimestamp;
    obj.reviewerAddress = review.reviewerAddress;

    reviewObjs.push(obj);
  });
  return reviewObjs;
};
