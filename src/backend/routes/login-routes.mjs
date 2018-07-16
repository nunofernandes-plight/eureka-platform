import express from 'express';
const router = express.Router();
import path from 'path';
const __dirname = path.resolve();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/src/backend/view/login.html'));
});

//router.post('/', function(req, res) {});

export default router;
