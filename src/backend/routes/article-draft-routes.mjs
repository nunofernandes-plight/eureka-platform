import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);
/**
 * Get some infos about all the drafts belonging to the user
 */
router.get('/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    return await articleVersionService.getDraftsOfUser(ethereumAddress);
  })
);

router.get(
  '/new',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) {
      errorThrower.notLoggedIn();
    }
    return await articleSubmissionService.createSubmission(ethereumAddress);
  })
);

/*** Get specific article-version if it is a draft*/
router.get(
  '/:draftId',
  asyncHandler(async req => {
    if (!req.params.draftId) {
      errorThrower.missingParameter('draftId');
    }

    const requesterAddress = req.session.passport.user.ethereumAddress;
    return await articleVersionService.getArticleVersionById(
      requesterAddress,
      req.params.draftId
    );
  })
);

router.put(
  '/:draftId',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    if (!req.params.draftId) errorThrower.missingParameter('DraftId');
    const draftId = req.params.draftId;

    return await articleVersionService.updateDraftById(ethereumAddress, draftId,
      req.body.document);

  })
);

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

    await articleVersionService.updateDraftById(ethereumAddress, draftId, req.body.document);
    return 'ArticleVersion with ID ' + draftId + ' updated';
  })
);


router.delete(
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

    return await articleSubmissionService.deleteSubmissionById(ethereumAddress, draftId);
  })
);

/**
 * Before submission to the SC, the frontend calls the backend providing the articleHash, so the DB can afterwards match SC submission with drafts
 */
router.put(
  '/:draftId/submit',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();

    const draftId = req.params.draftId;
    if(!req.body.articleHash) errorThrower.missingBodyValue('articleHash');
    return await articleVersionService.finishDraftById(
      ethereumAddress, draftId, req.body.articleHash
    );
  })
);


/********* ADMIN AREA *********/
router.use(accesController.rolesOnly(Roles.ADMIN));
router.get(
  '/',
  asyncHandler(async () => {
    return articleVersionService.getAllArticleVersions();
  })
);

export default router;
