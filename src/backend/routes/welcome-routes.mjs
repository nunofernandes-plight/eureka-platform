/**
 * Testing routes
 */
import express from 'express';
const router = express.Router();


router.get(
  '/',
  function (req, res) {
    res.send('Welcome to EUREKA!');
  }
);

export default router;
