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
      if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
          where: { content: tag.slice(1).toLowerCase() },
        })));
        await post.addHashtags(result.map(v => v[0]));
      }
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
          attributes: ['id'],
        }]
      });
      res.status(201).json(fullPost[0]);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete('/:postId',
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

router.put('/:postId', // PUT /post/1
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { content, images } = req.body;
      const { postId: PostId } = req.params;
      // const { id: UserId } = req.user;
      const hashtags = content.match(/#[^\s#]+/g);
      const post = await Post.findOne({ where: { id: PostId }});
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
        await Image.destroy({ where: { PostId }});
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

module.exports = router;