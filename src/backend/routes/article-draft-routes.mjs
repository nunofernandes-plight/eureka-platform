import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import articleDraftService from '../db/article-draft-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);
/**
 * Get some infos about all the drafts belonging to the user
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

/**
 * Updates the whole document of a draft by replacing it with the provided document
 */
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

/**
 * Updates the document of a draft with set all the variables provided
 */
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

    await articleDraftService.updateDraftVarsById(ethereumAddress, draftId, req.body.document);
    return 'Document with ID ' + draftId + ' updated';
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
