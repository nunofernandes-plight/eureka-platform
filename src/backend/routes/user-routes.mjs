import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
import userService from '../db/user-service.mjs';

router.get(
  '/',
  asyncHandler(async () => {
    return userService.getAllUsers();
  })
);

router.get(
  '/data',
  asyncHandler(async (req, res) => {
    if(!req.user) {
      let error = new Error('Not logged in  in Backend');
      error.status= 401;
      throw error;
    }

    return await userService.getUserByEthereumAddress(req.user);
  })
);

router.post(
  '/addRole',
  asyncHandler(async req => {
    return userService.addRole(req.body.user_id, req.body.role);
  })
);

router.post(
  '/makeEditor',
  asyncHandler(async req => {
    return userService.makeEditor(req.body.user_id);
  })
);

export default router;
