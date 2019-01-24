import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req) => {
    if (!req.user) {
      let error = new Error('User is already logged out!');
      error.status = 401;
      throw error;
    }
    req.logout(req.user);
    req.session.destroy();

    return {
      isAuthenticated: req.isAuthenticated()
    };
  })
);

export default router;
