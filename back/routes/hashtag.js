const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Post, Comment, User, Image, Hashtag } = require('../models');

router.get('/:tag', async (req, res, next) => { // GET /hashtag/[tag]?lastId
  try {
    const { tag } = req.params;
    const { lastId } = req.query;
    const where = {};
    if (parseInt(lastId, 10)) {
      where.id = { [Op.lt]: parseInt(lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 5,
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
