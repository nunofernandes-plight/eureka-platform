/**
 * Testing routes
 */
import express from 'express';
const router = express.Router();


router.get(
  '/',
  function (req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.send('Welcome to EUREKA! REQ_USER: ' + req.user + ' AUTHENTICATED: ' + req.isAuthenticated());
  }
);

export default router;
