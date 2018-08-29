import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import scTransactionService from '../db/sc-transaction-service.mjs';
import accesController from '../controller/acess-controller.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);
/**
 * Get all Smart contract transactions from the user requesting them
 */
router.get(
  '/',
  asyncHandler(async req => {
    return scTransactionService.getAllScTransactionOfUser(req.user.ethereumAddress);
  })
);


export default router;
