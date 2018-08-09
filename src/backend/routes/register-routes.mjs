import express from 'express';
import path from 'path';
import userService from '../db/user-service.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/', asyncHandler(async (req, res) => {
  let newUserInDB = await userService.createUser(req.body.password,
    req.body.email, req.body.ethereumAddress, req.body.avatar);

  return new Promise((resolve, reject) =>
    req.login(newUserInDB, (err) => {
      if (err) {
        let error = new Error('Login did not work!');
        error.status = 401;
        reject(error);
      } else {
        resolve(newUserInDB);
      }
    })(req, res));
}));

export default router;
