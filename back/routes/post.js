const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Post, Hashtag, Image, Comment, User } = require('../models');

router.post('/', // POST /post
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { content, images } = req.body;
      const { id: UserId } = req.user;
      const hashtags = content.match(/#[^\s#]+/g);
      const post = await Post.create({ content, UserId });
      // 해시태그 테이블에 저장
      if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
          where: { content: tag.slice(1).toLowerCase() },
        })));
        await post.addHashtags(result.map(v => v[0]));
      }
      // 업로드한 이미지를 이미지 테이블에 저장
      const uploadedImage = await Promise.all(images.map(img => Image.create({ src: img.src })));
      await post.addImages(uploadedImage);
      const fullPost = await Post.findOrCreate({
        where: { id: post.id },
        include: [{
          model: Image,
          attributes: ['id', 'src'],
        }, {
          model: User,
          attributes: ['id', 'nickname', 'avatar'],
        }, {
          model: Comment,
          include: [{
            model: User, // 덧글 작성자
            attributes: ['id', 'nickname', 'avatar'],
          }]
        }, {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id', 'nickname', 'avatar'],
          through: { attributes: [] },
        }]
      });
      res.status(201).json(fullPost[0]);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete('/:postId',  // DELETE /post/1
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { id: UserId } = req.user;
      await Post.destroy({
        where: { id: postId, UserId }
      });
      res.status(200).send(postId);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.patch('/:postId', // PATCH /post/1
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { content, images } = req.body;
      const { postId } = req.params;
      const hashtags = content.match(/#[^\s#]+/g);
      const post = await Post.findOne({ where: { id: postId }});
      // 해시태그 변경
      const exHashtag = await post.getHashtags();
      if (exHashtag) { // 삭제한 해시태그 삭제
        const removeHashtag = exHashtag.filter((t, i) => '#' + t.content !== hashtags[i]);
        await post.removeHashtags(removeHashtag);
      }
      if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
          where: { content: tag.slice(1).toLowerCase() },
        })));
        await post.addHashtags(result.map(v => v[0]));
      }
      // 이미지 변경
      const uploadedImages = [];
      const exImage = await post.getImages();
      if (images.every((img, i) => img !== exImage[i].src)) { //이미지 변경이 있을 경우
        await Image.destroy({ where: { postId }});
        const uploadImg = await Promise.all(images.map(img => Image.create({ src: img.src })));
        await post.addImages(uploadImg);
        uploadImg.forEach(v => uploadedImages.push(v));
      } else { // 이미지를 변경하지 않는 경우
        exImage.forEach(v => uploadedImages.push(v));
      }
      // 본문 내용 변경
      await Post.update({ content }, { 
        where: { id: post.id }
      });
      res.status(201).json({ content, images: uploadedImages });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post('/:postId/comment', // POST /post/1/comment
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
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
  }
);

router.delete('/:postId/comment/:commentId', // DELETE /post/1/comment/1
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
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
  }
);

router.patch('/:postId/like/', // PATCH /post/1/like
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
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
  }
);

router.delete('/:postId/like/', // DELETE /post/1/like
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
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
  }
);

router.get('/:postId/list', async (req, res, next) => { // GET /post/1/list
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: postId}});
    const list = await post.getLikers({
      attributes: ['id'],
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'avatar'],
      }],
    });
    res.status(200).json(list);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;