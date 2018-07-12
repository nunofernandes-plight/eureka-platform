import express from 'express';
import passport from '../auth/localPassport';

const router = express.Router();

router.post('/', passport.authenticate('local', {failureRedirect: '/error'}),
  function (req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.send('Succes with logging in')
  });


export default router;