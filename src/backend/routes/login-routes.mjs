import express from 'express';
import path from 'path';
import {asyncHandler} from '../api/requestHandler.mjs';
import userService from '../db/user-service.mjs';
import passport from '../helpers/local-passport.mjs';
import User from '../schema/user';
import bcryptHasher from '../helpers/bcrypt-hasher.mjs';


const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/login.html'));
});

router.post('/', asyncHandler(async (req, res) => {
  return new Promise((resolve, reject) =>
    passport.authenticate('local', (err, user) => {
      if (err) {
        reject(err);
      }
      if (!user) {
        let error = new Error('Provided Login credentials are wrong');
        error.status = 401;
        reject(error);
      } else {
        req.login(user, (err) => {
          if (err) {
            let error = new Error('Login error');
            error.status = 500;
            reject(error);
          }
          resolve(user);
        });
      }
    })(req, res));
}));
export default router;
