import express from 'express';
import accesController from '../controller/acess-controller.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import ARTICLE_VERSION_STATE from '../schema/article-version-state-enum.mjs';
import {getRelevantArticleData} from '../helpers/relevant-article-data.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.get(
  '/submitted',
  asyncHandler(async req => {
    return await articleVersionService.getSubmittedAndFinishedDraftOfUser(
      req.session.passport.user.ethereumAddress
    );
  })
);

/*
  articles assigned to an Editor
  */
// TODO: router.use(accesController.rolesOnly([Roles.EDITOR]));
router.get(
  '/assigned/:id'
  // asyncHandler(async req => {
  //   return await articleVersionService.getArticleAssignedTo(req.session.passport.user.ethereumAddress, req.params.id);
  // })
);

router.get(
  '/assigned/signoff',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesAssignedTo(
      req.session.passport.user.ethereumAddress,
      [ARTICLE_VERSION_STATE.SUBMITTED]
    );
    return getArticlesResponse(articles);
  })
);

router.get(
  '/assigned/inviteReviewers',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesAssignedTo(
      req.session.passport.user.ethereumAddress,
      [ARTICLE_VERSION_STATE.OPEN_FOR_ALL_REVIEWERS]
    );
    return getArticlesResponse(articles);
  })
);

router.get(
  '/assigned/finalize',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesToFinalize(
      req.session.passport.user.ethereumAddress
    );
    return getArticlesResponse(articles);
  })
);


/*
  articles open for a reviewer
  */
// TODO clear editor roles only and use: router.use(accesController.rolesOnly([Roles.REVIEWER]));
router.get(
  '/reviewable',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesOpenForReviews(
      req.session.passport.user.ethereumAddress
    );
    return getArticlesResponse(articles);
  })
);

router.get(
  '/reviewable/invited',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesOpenForExpertReviews(
      req.session.passport.user.ethereumAddress
    );
    return getArticlesResponse(articles);
  })
);

router.get(
  '/reviewable/expert',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesOpenForExpertReviews(
      req.session.passport.user.ethereumAddress
    );
    return getArticlesResponse(articles);
  })
);

router.get(
  '/reviewable/community',
  asyncHandler(async req => {
    let articles = await articleVersionService.getArticlesOpenForCommunityReviews(
      req.session.passport.user.ethereumAddress
    );
    return getArticlesResponse(articles);
  })
);

export default router;

export const getArticlesResponse = articles => {
  let resArticles = [];
  articles.map(article => {
    if (article.articleSubmission)
      resArticles.push(getRelevantArticleData(article.articleSubmission, article));
  });
  return resArticles;
};