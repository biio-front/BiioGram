const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

router.post('/signup', async(req, res, next) => { // POST /user/signup
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', async(req, res, next) => { // POST /user/login
  passport.authenticate('local', (error, user, errorInfo) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (errorInfo) {
      console.error(errorInfo);
      return res.status(401).send(errorInfo.reason);
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

module.exports = router;