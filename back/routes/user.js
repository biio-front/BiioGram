const { User, Post, Image, Comment } = require('../models');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', async (req, res, next) => { // GET /user/
  try {
    if (!req.user) {
      return res.status(200).send(null);
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:userId/edit', isLoggedIn, async (req, res, next) => { // PATCH /user/1/edit
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
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
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
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // DELETE /user/1/follow
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
});

router.get('/:userId', async (req, res, next) => { // GET /user/1/
  try {
    const { userId } = req.params;
    const user = await User.findOne({ 
      where: { id: userId },
      attributes: ['nickname', 'desc', 'avatar'],
      order: [[Post, 'createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id', 'nickname', 'avatar'],
        through: { attributes: [] },
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id', 'nickname', 'avatar'],
        through: { attributes: [] },
      }, {
        model: Post,
        attributes: ['id'],
        include: [{
          model: Image,
        }, {
          model: Comment,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Likers',
          attributes: ['id'],
          through: { attributes: [] },
        }],
      }]
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;