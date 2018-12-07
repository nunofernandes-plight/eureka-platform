import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import dashboardService from '../db/dashboard-service.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.get(
  '/',
  asyncHandler(async req => {
    const address = req.user.ethereumAddress;
    return dashboardService.getAnalytics(address);
  })
);

export default router;
