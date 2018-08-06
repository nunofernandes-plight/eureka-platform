import express from 'express';
import path from 'path';
import userService from '../db/user-service.mjs';
import {asyncHandler} from '../api/requestHandler.mjs';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/',
  asyncHandler(async (req, res) => {
    let newUserInDB = await userService.createUser(req.body.password,
      req.body.email, req.body.ethereumAddress);

    req.login(newUserInDB, function(err) {
      if (err) {
        let error = new Error('Login did not work!');
        error.status = 401;
        throw error;
      } else {
        return newUserInDB;
        // res.status = 201; TODO fix problem with setting headers after res has ben sent
        // res.json({
        //   data: newUserInDB
        // });
      }
    });
    // return userService
    //   .createUser(req.body.password, req.body.email, req.body.ethereumAddress)
    //   .then(newUserInDB => {
    //     req.login(newUserInDB, function(err) {
    //       if (err) {
    //         let error = new Error('Login did not work!');
    //         error.status = 401;
    //         throw error;
    //       } else {
    //         res.json({
    //           status: 201,
    //           data: newUserInDB
    //         });
    //       }
    //     });
    //   });
  })
);

export default router;
