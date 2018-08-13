import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../helpers/acess-controller.mjs';

const router = express.Router();
import articleDraftService from '../db/article-draft-service.mjs';
import Roles from '../schema/roles-enum';
import errorThrower from '../helpers/error-thrower.mjs';

router.use(accesController.loggedInOnly);

router.post(
  '/',
  asyncHandler(async (req) => {
    if (!req.body.ethereumAddress) {
      errorThrower.missingParameter('ethereumAddress');
    }

    let newDraft = await articleDraftService.createDraft(req.body.ethereumAddress);
    console.log(newDraft);
    return newDraft;
  })
);

router.get('/:draftId',
  asyncHandler(async req => {
    if (!req.params.draftId) {
      errorThrower.missingParameter('draftId');
    }

    const requesterAddress = req.session.passport.user.ethereumAddress;
    return await articleDraftService.getDraftById(requesterAddress, req.params.draftId);
  })
);


router.use(accesController.rolesOnly(Roles.ADMIN));
router.get(
  '/',
  asyncHandler(async () => {
    return articleDraftService.getAllArticleDrafts();
  })
);

export default router;