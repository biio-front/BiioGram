const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Post, Comment, User, Image } = require('../models');

router.get('/', async (req, res, next) => {
  try {
  const { lastId } = req.query;
    const where = {};
    // lastId가 존재하는 경우(스크롤 후). 초기로딩일경우 where없음.
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
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }, {
        model: Image,
        attributes: ['id', 'src'],
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