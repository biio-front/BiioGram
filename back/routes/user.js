const { User, Post, Image, Comment } = require('../models');
const express = require('express');
const router = express.Router();
const passport = require('passport');

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
        avatar: src, nickname, desc 
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

router.get('/', // GET /user  // 내 정보 가져오기
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

router.get('/:userId', async (req, res, next) => { // GET /user/1/
  try {
    const { userId } = req.params;
    const user = await User.findOne({ 
      where: { id: userId },
      attributes: ['nickname', 'desc', 'avatar'],
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;