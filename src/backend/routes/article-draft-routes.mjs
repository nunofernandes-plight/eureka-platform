import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import articleDraftService from '../db/article-draft-service.mjs';

router.get(
  '/',
  asyncHandler(async () => {
    return articleDraftService.getAllArticleDrafts();
  })
);

router.post(
  '/',
  asyncHandler(async (req) => {
    if(!req.ethereumAddress) {
      let error = new Error('No ethereum address provided');
      error.status= 400;
      throw error;
    }
    return await articleDraftService.createDraft(req.ethereumAddress);
  })
);