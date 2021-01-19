const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');  // 노드에서 제공하는 모듈
const { Post, Hashtag, Image, Comment, User } = require('../models');

const upload = multer({
  storage: diskStorage({  // 어디에 저장할 것인가? 일단은 하드디스크
    destination(req, file, done) {
      done(null, 'uploads');   // 업로즈 폴더에...
    },
    filename(req, file, done) {  // 비오.png
      const ext = path.extname(file.originalname);  //확장자 추출(png)
      const basename = path.basename(file.originalname, ext); // 비오
      done(null, basename + '_' + new Date().getTime() + ext); // 비오1234(시간초).png
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
});
router.post('/images',
  passport.authenticate('jwt', { session: false }), 
  upload.array('image'),
  async (req, res, next) => {
    try {
      const { files } = req;
      res.status(200).json(files.map(file => file.filename));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post('/', // POST /post
  passport.authenticate('jwt', { session: false }), 
  async (req, res, next) => {
    try {
      const { content, image } = req.body;
      const { id: UserId } = req.user;
      const hashtags = content.match(/#[^\s#]+/g);
      const post = await Post.create({ content, UserId });
      if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
          where: { content: tag.slice(1).toLowerCase() },
        })));
        await post.addHashtags(result.map(v => v[0]));
      }
      const uploadedImage = await Promise.all(image.map(img => Image.create({ src: img.src })));
      await post.addImages(uploadedImage);
      const fullPost = await Post.findOrCreate({
        where: { id: post.id },
        include: [{
          model: Image,
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
      res.status(201).json(fullPost);
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
      const post = await Post.destroy({
        where: { id: postId, UserId }
      });
      res.status(200).send(postId);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;