import express from 'express';
import accesController from '../controller/acess-controller.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import Roles from '../schema/roles-enum.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.get('/submitted',
  asyncHandler(async req => {
    return await articleVersionService.getSubmittedAndFinishedDraftOfUser(req.session.passport.user.ethereumAddress);
  })
);

//TODO: only for editors: router.use(accesController.rolesOnly(Roles.EDITOR));

router.get('/assigned/:id',
  // asyncHandler(async req => {
  //   return await articleVersionService.getArticleAssignedTo(req.session.passport.user.ethereumAddress, req.params.id);
  // })
);

router.get('/assigned/signoff',
  asyncHandler(async req => {
    return await articleVersionService.getArticlesAssignedTo(req.session.passport.user.ethereumAddress, ARTICLE_VERSION_STATE.SUBMITTED);
  })
);

router.get('/assigned/inviteReviewers',
  asyncHandler(async req => {
    return await articleVersionService.getArticlesAssignedTo(req.session.passport.user.ethereumAddress, ARTICLE_VERSION_STATE.EDITOR_CHECKED);
  })
);

router.get('/assigned/checkReviews',
  asyncHandler(async req => {
    return await articleVersionService.getArticlesAssignedTo(req.session.passport.user.ethereumAddress, ARTICLE_VERSION_STATE.REVIEWERS_INVITED);
  })
);

router.get('/assigned/finalize',
  asyncHandler(async req => {
    return await articleVersionService.getArticlesAssignedTo(req.session.passport.user.ethereumAddress, ARTICLE_VERSION_STATE.REVIEWERS_INVITED);
  })
);

export default router;