import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../helpers/acess-controller.mjs';
import articleDraftService from '../db/article-draft-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);
/**
 * Get all drafts belonging to the user
 */
router.get(
  '/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) {
      errorThrower.notLoggedIn();
    }
    return await articleDraftService.getDraftsOfUser(ethereumAddress);
  })
);
/**
 * Create a new article draft
 */
router.get(
  '/new',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) {
      errorThrower.notLoggedIn();
    }
    return await articleDraftService.createDraft(ethereumAddress);
  })
);


/**
 * Get specific draft by draftId
 */
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

// router.put(
//   '/:draftId',
//   asyncHandler(async req => {
//     const draftId = req.params.draftId;
//     if (!req.params.draftId) {
//       errorThrower.missingParameter('draftId');
//     }
//
//     const ethereumAddress = req.session.passport.user.ethereumAddress;
//     if (!ethereumAddress) {
//       errorThrower.notLoggedIn();
//     }
//
//     return await articleDraftService.updateDraftById(ethereumAddress, draftId, req.body.document);
//   })
// );

router.put(
  '/:draftId',
  asyncHandler(async req => {
    const draftId = req.params.draftId;
    if (!req.params.draftId) {
      errorThrower.missingParameter('draftId');
    }

    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) {
      errorThrower.notLoggedIn();
    }

    return await articleDraftService.updateDraftVarsById(ethereumAddress, draftId, req.body.document);
  })
);




/** ADMIN AREA **/
router.use(accesController.rolesOnly(Roles.ADMIN));
router.get(
  '/',
  asyncHandler(async () => {
    return articleDraftService.getAllArticleDrafts();
  })
);

export default router;
