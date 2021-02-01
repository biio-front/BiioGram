const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/auth');
const { Post, User } = require('../../models');

router.patch('/:postId/like/', async (req, res, next) => {  // PATCH /post/1/like
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;
    const post = await Post.findOne({ where: { id: postId }});
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.addLikers(userId);
    const user = await User.findOne({ 
      where: { id: userId },
      attributes: ['id', 'nickname', 'avatar'],
    })
    res.status(200).json({ postId: post.id, user });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like/', isLoggedIn, async (req, res, next) => {  // DELETE /post/1/like
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;
    const post = await Post.findOne({ where: { id: postId }});
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    await post.removeLikers(userId);
    res.status(200).json({ postId: post.id, userId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router