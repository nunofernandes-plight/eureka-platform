import express from 'express';
import accesController from '../controller/acess-controller.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

const router = express.Router();
router.use(accesController.loggedInOnly);

router.get('/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    return await articleSubmissionService.getSubmissionsOfUser(ethereumAddress);
  })
);

export default router;
