import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import reviewService from '../db/review-service.mjs';
import accesController from '../controller/acess-controller.mjs';
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
    return reviewService.getReviewInvitations(req.session.passport.user.ethereumAddress);
  })
);

router.get(
  '/myreviews',
  asyncHandler(async req => {
    return reviewService.getMyReviews(req.session.passport.user.ethereumAddress);
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
