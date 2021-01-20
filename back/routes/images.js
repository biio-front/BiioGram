const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const { diskStorage } = require('multer');
const path = require('path');  // 노드에서 제공하는 모듈

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

router.post('/', // POST /images
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

module.exports = router;