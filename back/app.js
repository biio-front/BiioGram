const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');  

const passport = require('passport');
const passportConfig = require('./passport');

const userRouter = require('./routes/user.js');
const postRouter = require('./routes/post.js');
const postsRouter = require('./routes/posts.js');
const imagesRouter = require('./routes/images.js');

const db = require('./models');
const app = express();

db.sequelize.sync()
.then(() => console.log('db 연결 성공'))
.catch(console.error);

// print the request log on console
app.use(morgan('dev'));

// set the cors
app.use(cors({
  origin: 'http://localhost:3050',
  credentials: true,
}));

app.use('/', express.static(path.join(__dirname, 'uploads')));

// parse json and url-encoded query
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());
passportConfig();

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/images', imagesRouter);

app.listen(3055, () => {
  console.log('서버 실행중');
});