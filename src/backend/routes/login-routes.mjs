import express from 'express';
import path from 'path';
import passport from '../helpers/local-passport.mjs';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/login.html'));
});

router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/api/welcome/logged-in',
    failureRedirect: '/api/welcome/logged-in'
  })
);

export default router;
