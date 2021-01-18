const { User } = require('../models');
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

router.post('/signup', async (req, res, next) => { // POST /user/signup
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
    res.status(201).send('회원가입 되었습니다.');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => { // POST /user/login
  passport.authenticate('local', { sessions: false }, (error, user, errorInfo) => {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (errorInfo) {
      console.error(errorInfo);
      return res.status(401).send(errorInfo.reason);
    }
    return req.login(user, { sessions: false }, async (loginError) => {
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
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      });
      const refreshToken = jwt.sign(
        {},
        process.env.JWT_SECRET,
        { expiresIn: '14d' },
      );
      // DB에 refreshToken 저장...?
      const accessToken = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '5m' },
      );
      res.cookie('RefreshToken', refreshToken, { httpOnly: true })
      return res.status(200).json({ me: fullUserWithoutPassword, token: accessToken });
    });
  })(req, res, next);
});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => { // GET /user
  try {
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
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    });
    res.json(fullUserWithoutPassword);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;