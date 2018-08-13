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
    if(!req.body.ethereumAddress) {
      let error = new Error('No ethereum address provided');
      error.status= 400;
      throw error;
    }

    let newDraft =  await articleDraftService.createDraft(req.body.ethereumAddress);
    console.log(newDraft);
    return newDraft;
  })
);

router.get('/:draftId',
  asyncHandler(async req => {

  }));

export default router;