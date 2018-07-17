import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import reviewService from '../db/review-service';
import userService from '../db/user-service';

router.get(
  '/',
  asyncHandler(async () => {
    //return reviewService.getAllReviews();
  })
);

router.post(
  '/',
  asyncHandler(async req => {
    return userService.addRole(req.body.user_id, req.body.role);
  })
);

export default router;