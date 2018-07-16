import express from 'express';
import path from 'path';
import userService from '../db/user-service';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/', async function (req, res) {
  userService.createUser(
    req.body.username,
    req.body.password,
    req.body.email
  ).then((response) => {
    res.send(response);
  })
    .catch((err) => {
      res.send(err);
    })
});

export default router;
