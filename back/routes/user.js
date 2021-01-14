const express = require('express');
const router = express.Router();

router.post('/signup', async(req, res, next) => { // POST /user/signup
  try {
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;