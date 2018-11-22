import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import frontendTransactionService from '../db/frontend-transaction-service.mjs';

const router = express.Router();
router.use(accesController.loggedInOnly);

router.post(
  '/',
  asyncHandler(async req => {
    const address = req.user.ethereumAddress;
    const txHash = req.body.txHash;
    const timestamp = new Date().getTime();
    const type = req.body.type;
    return frontendTransactionService.addTransaction(
      address,
      type,
      timestamp,
      txHash
    );
  })
);

router.get(
  '/',
  asyncHandler(async req => {
    const address = req.user.ethereumAddress;
    return frontendTransactionService.getAllTxs(address);
  })
);

router.delete(
  '/',
  asyncHandler(async req => {
    const address = req.user.ethereumAddress;
  })
);

export default router;
