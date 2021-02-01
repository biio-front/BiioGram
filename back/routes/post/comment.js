const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/auth');
const { Post,Comment, User } = require('../../models');

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // POST /post/1/comment
  try {
    const { postId: PostId } = req.params;
    const { content } = req.body;
    const { id: UserId } = req.user;
    const post = await Post.findOne({ where: { id: PostId }});
    if(!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({ PostId, content, UserId });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }]
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/comment/:commentId', isLoggedIn, async (req, res, next) => { // DELETE /post/1/comment/1
  try {
    const { postId, commentId } = req.params;
    const { id: UserId } = req.user;
    await Comment.destroy({ where: { id: commentId, PostId: postId, UserId }});
    res.status(200).json({ 
      postId: parseInt(postId, 10), 
      commentId: parseInt(commentId, 10),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;