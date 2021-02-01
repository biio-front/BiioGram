const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares/auth');
const { Post, Hashtag, Image, Comment, User } = require('../../models');
const likeRouter = require('./like');
const commentRouter = require('./comment');

router.post('/', isLoggedIn, async (req, res, next) => { // POST /post
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
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => { // DELETE /post/1
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
});

router.patch('/:postId',  isLoggedIn, async (req, res, next) => { // PATCH /post/1
  try {
    const { content, images } = req.body;
    const { postId } = req.params;
    const { id: UserId } = req.user;
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
      where: { id: post.id, UserId }
    });
    res.status(201).json({ content, images: uploadedImages });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.use(likeRouter);
router.use(commentRouter);

module.exports = router