import express from 'express';
import path from 'path';
import userService from '../db/user-service.mjs';
import {asyncHandler} from "../api/requestHandler.mjs";

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/',
  asyncHandler(async (req, res) => {
    return userService
      .createUser(req.body.password, req.body.email, req.body.ethereumAddress)
      .then(res.status(201));
  })
);

export default router;
