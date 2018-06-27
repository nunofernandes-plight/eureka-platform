import express from 'express';
import {asyncHandler} from '../api/requestHandler';
const router = express.Router();
import db from '../db/db';

router.get(
  '/',
  asyncHandler(async () => {
    return db.getAllReviews();
  })
);

router.post(
  '/',
  asyncHandler(async req => {
    return db.insertReview(req.body);
  })
);

export default router;
