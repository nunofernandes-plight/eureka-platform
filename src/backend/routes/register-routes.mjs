import express from 'express';
import path from 'path';
import userService from '../db/user-service.mjs';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/', async function(req, res) {
  userService
    .createUser(req.body.password, req.body.email, req.body.ethereumAddress)
    .then(newUserInDB => {
      req.login(newUserInDB._id, function(err) {
        if (err) res.send('Login error: ' + err);
        res.send(newUserInDB);
      });
    })
    .catch(err => {
      res.send('Registration error: ' + err);
    });
});

export default router;
