import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import reviewService from '../db/review-service';

router.get(
  '/',
  asyncHandler(async () => {
    return reviewService.getAllReviews();
  })
);

router.post(
  '/',
  asyncHandler(async req => {
    return reviewService.createReview(req.body);
  })
);

export default router;
