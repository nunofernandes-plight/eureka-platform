import express from 'express';
import path from 'path';
import userService from '../db/user-service'

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/register.html'));
});

router.post('/', async function (req, res) {
  const newDBUser = await userService.createUser(req.body.username, req.body.password, req.body.email);

  // login user after creation
  req.login(newDBUser._id, function (err) {
    if(err) throw err;
    console.log(req.user);
    console.log(req.isAuthenticated());
  });
  res.send(newDBUser);
});

export default router;