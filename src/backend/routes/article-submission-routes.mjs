import express from 'express';
import accesController from '../controller/acess-controller';
import {asyncHandler} from '../api/requestHandler';
import articleSubmissionService from '../db/article-submission-service.mjs';
import errorThrower from '../helpers/error-thrower';

const router = express.Router();
router.use(accesController.loggedInOnly);

router.get('/',
  asyncHandler(async req => {
    const ethereumAddress = req.session.passport.user.ethereumAddress;
    if (!ethereumAddress) errorThrower.notLoggedIn();
    return await articleSubmissionService.getSubmissionsOfUser(ethereumAddress);
  })
);

