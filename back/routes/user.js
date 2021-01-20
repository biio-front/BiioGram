const { User, Post, Image, Comment } = require('../models');
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
      res.cookie('RefreshToken', refreshToken, { httpOnly: true, secure: true });
      return res.status(200).json({ me: fullUserWithoutPassword, token: accessToken });
    });
  })(req, res, next);
});

router.delete('/logout', // DELETE /user/logout
  async (req, res,) => { 
    req.logout();
    res.clearCookie('RefreshToken');
    res.status(200).send('ok');
  }
);

router.get('/', // GET /user
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => { 
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
  }
);

router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
  try {
    const { userId } = req.params;
    const posts = await Post.findAll({
      where: { UserId: userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Image,
      }, {
        model: Comment,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/followers', async (req, res, next) => { // GET /user/1/followers
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId }
    });
    const followers = await user.getFollowers({
      attributes: ['nickname', 'id', 'avatar']
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/followings', async (req, res, next) => { // GET /user/1/followings
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId }
    });
    const followings = await user.getFollowings({
      attributes: ['nickname', 'id', 'avatar']
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:userId/edit',   // PATCH /user/1/edit
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { id } = req.user;
      const { src, nickname, desc } = req.body;
      if (parseInt(userId, 10) !== id) {
        return res.status(403).send('잘못된 접근입니다.');
      }
      await User.update({ 
        src, nickname, desc 
      }, {
        where: { id }
      });
      res.status(201).json({ src, nickname, desc });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.patch('/:userId/follow', // PATCH /user/1/follow
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { id } = req.user;
      const user = await User.findOne({  // 팔로우 할 대상
        where: { id: userId }
      });
      if (!user) {
        return res.status(403).send('존재하지 않는 유저입니다.');
      }
      await user.addFollowers(id); // 대상 팔로워리스트에 나 더하기(팔로잉하기)
      res.status(200).json(parseInt(userId, 10));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete('/:userId/follow', // DELETE /user/1/follow
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { id } = req.user;
      const user = await User.findOne({  // 팔로우 할 대상
        where: { id: userId }
      });
      if (!user) {
        return res.status(403).send('존재하지 않는 유저입니다.');
      }
      await user.removeFollowers(id); // 대상 팔로워리스트에서 나 빼기(팔로잉취소)
      res.status(200).json(parseInt(userId, 10));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;