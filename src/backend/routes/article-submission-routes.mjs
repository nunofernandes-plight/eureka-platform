import express from 'express';
import accesController from '../controller/acess-controller.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import Roles from '../schema/roles-enum.mjs';
import {getRelevantArticleData} from '../helpers/relevant-article-data.mjs';

const router = express.Router();
router.use(accesController.loggedInOnly);

router.use(accesController.loggedInOnly);

router.get(
  '/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    return await articleSubmissionService.getSubmissionsOfUser(ethereumAddress);
  })
);

router.use(
  accesController.rolesOnly([Roles.EDITOR, Roles.ADMIN, Roles.CONTRACT_OWNER])
);
router.get(
  '/unassigned',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    let submissions = await articleSubmissionService.getUnassignedSubmissions(
      ethereumAddress,
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );
    const array = getSubmissionResponse(submissions);
    return {array, pages: 10};
  })
);

router.get(
  '/assigned',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    let submissions = await articleSubmissionService.getAssignedSubmissions(
      ethereumAddress
    );
    return getSubmissionResponse(submissions);
  })
);

export default router;

const getSubmissionResponse = submissions => {
  let resSubmissions = [];
  submissions.map(submission => {
    let lastArticleVersion =
      submission.articleVersions[submission.articleVersions.length - 1];
    resSubmissions.push(getRelevantArticleData(submission, lastArticleVersion));
  });
  return resSubmissions;
};
