import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../helpers/acess-controller.mjs';
const router = express.Router();
import articleDraftService from '../db/article-draft-service.mjs';

router.use(accesController.loggedInOnly);
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
    if(!req.params.draftId) {
      let error = new Error('No draft ID provided');
      error.status= 400;
      throw error;
    }

    const requesterAddress = req.session.passport.user.ethereumAddress;
    return await articleDraftService.getDraftById(requesterAddress, req.params.draftId);
  }));

export default router;