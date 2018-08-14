import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../helpers/acess-controller.mjs';
import articleDraftService from '../db/article-draft-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.post(
  '/new',
  asyncHandler(async req => {
    if (!req.body.ethereumAddress) {
      errorThrower.missingParameter('ethereumAddress');
    }
    return await articleDraftService.createDraft(req.body.ethereumAddress);
  })
);

router.get(
  '/:draftId',
  asyncHandler(async req => {
    if (!req.params.draftId) {
      errorThrower.missingParameter('draftId');
    }

    const requesterAddress = req.session.passport.user.ethereumAddress;
    return await articleDraftService.getDraftById(
      requesterAddress,
      req.params.draftId
    );
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
