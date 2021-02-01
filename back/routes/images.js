const express = require('express');
const router = express.Router();

const multer = require('multer');
const { diskStorage } = require('multer');
const fs = require('fs');  // 파일 시스템을 조작할수있는 모듈
const path = require('path');

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: diskStorage({  // 어디에 저장할 것인가? 일단은 하드디스크
    destination(req, file, done) {
      done(null, 'uploads');   // 업로즈 폴더에...
    },
    filename(req, file, done) {  
      const filename = path.basename(file.originalname);  // 비오.png
      done(null, `${Date.now()}_${filename}`); // 시간스탬프_비오.png
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
});

router.post('/', upload.array('image'), async (req, res, next) => { // POST /images
  try {
    const { files } = req;
    res.status(200).json(files.map(file => file.filename));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;