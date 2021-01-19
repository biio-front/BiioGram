const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Post, Comment, User, Image } = require('../models');

router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const posts = await Post.findAll({
        order: [
          ['createdAt', 'DESC'],
          [Comment, 'createdAt', 'DESC'],
        ],
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname', 'avatar'],
          }],
        }, {
          model: User,
          as: 'Likers',
          attributes: ['id', 'avatar'],
        }]
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;