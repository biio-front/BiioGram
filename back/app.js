const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');  
const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');
const passportConfig = require('./passport');

const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/user.js');
const postRouter = require('./routes/post/index.js');
const postsRouter = require('./routes/posts.js');
const imagesRouter = require('./routes/images.js');
const hashtagRouter = require('./routes/hashtag.js');

const db = require('./models');
const app = express();

db.sequelize.sync()
.then(() => console.log('db 연결 성공'))
.catch(console.error);

// print the request log on console
app.use(morgan('dev'));

// parse json and url-encoded query
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set the cors
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3050'],
  credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false, 
  resave: false, 
  name: 'userSession',
  secret: process.env.COOKIE_SECRET, 
  cookie: {
    httpOnly: true, 
    secure: false, 
  }
}));

app.use('/', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/images', imagesRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3055, () => {
  console.log('서버 실행중');
});