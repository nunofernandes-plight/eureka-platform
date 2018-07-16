import express from 'express';
import path from 'path';
import passport from '../helpers/local-passport'

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function(req, res) {
  req.logout();
  req.session.destroy();
  res.send('Successfully logged out');
});

export default router;