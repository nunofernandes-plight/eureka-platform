import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  req.logout(req.user);
  req.session.destroy();
  res.send('Successfully logged out');
});

export default router;
