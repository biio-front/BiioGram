const { User } = require('../models');
const express = require('express');
const router = express.Router();

const passport = require('passport');

const bcrypt = require('bcrypt');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares/auth');

router.post('/signup', isNotLoggedIn, async (req, res, next) => { // POST /user/signup
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({
      where: { email }
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email: email,
      nickname: nickname,
      password: hashedPassword,
    });
    res.status(201).send('sign up');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => { // POST /user/login
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
      const { id } = req.user;
      const fullUserWithoutPassword = await User.findOne({
        where: { id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id'],
          through: { attributes: [] },
        }]
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.delete('/logout', isLoggedIn, (req, res) => { // DELETE /user/logout
  req.logout();
  res.status(200).send('logout');
  res.clearCookie('userSession');
});

module.exports = router;