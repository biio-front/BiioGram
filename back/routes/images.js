const express = require('express');
const router = express.Router();

const multer = require('multer');
const multers3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});
const uploadPost = multer({
  storage: multers3({  
    s3: new AWS.S3(),
    bucket: 'biiogram',
    key(req, file, cb) {
      cb(null, `original/post/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
});
const uploadAvatar = multer({
  storage: multers3({  
    s3: new AWS.S3(),
    bucket: 'biiogram',
    key(req, file, cb) {
      cb(null, `original/avatar/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 용량제한 20Mb
});

router.post('/post', uploadPost.array('image'), async (req, res, next) => { // POST /images/post
  try {
    const { files } = req;
    res.status(200).json(files.map(file => file.location));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/avatar', uploadAvatar.array('image'), async (req, res, next) => { // POST /images/avatar
  try {
    const { files } = req;
    res.status(200).json(files.map(file => file.location));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;