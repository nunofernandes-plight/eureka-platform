import express from 'express';
import hasher from '../helpers/hasher';
import mongoose from '../db/mongoose';
import userSchema from '../schemas/user';

const User = mongoose.model('users', userSchema, 'users');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body.password);
  let hashedPassword = await hasher.hash(req.body.password);
  console.log('Hash from API: ' + hashedPassword);
  const user = new User({
    'username': req.body.username,
    'password': hashedPassword
  });
  user.save(function (err, results) {
    if (err) throw err;

    const user_id = results._id;
    console.log('User ID: ' + user_id);
    req.login(user_id, function (err) {

      res.send('Signed up');
    });
  })
});

export default router;