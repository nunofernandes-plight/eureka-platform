import express from 'express';
import accesController from '../controller/acess-controller.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';
import articleVersionService from '../db/article-version-service.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.get('/',
  asyncHandler(async req => {
    return await articleVersionService.getSubmittedAndFinishedDraftOfUser(req.session.passport.user.ethereumAddress);
  })
);

export default router;