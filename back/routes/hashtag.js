const express = require('express');
const router = express.Router();
const { Post, Comment, User, Image, Hashtag } = require('../models');

router.get('/:tag', async (req, res, next) => { // GET /hashtag/[tag]
  try {
    const { tag } = req.params;
    const posts = await Post.findAll({
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: Hashtag,
        as: 'Hashtags',
        where: { content: decodeURIComponent(tag) },
        through: { attributes: [] },
      }, {
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id', 'nickname', 'avatar'],
        through: { attributes: [] },
      }]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
