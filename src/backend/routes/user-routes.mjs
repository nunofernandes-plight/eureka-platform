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
  '/auth',
  asyncHandler(async () => {
    return userService.isAuth();
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
