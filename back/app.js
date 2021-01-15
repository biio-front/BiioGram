const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const passportConfig = require('./passport');

const userRouter = require('./routes/user.js');
const db = require('./models');
const passport = require('passport');

db.sequelize.sync()
.then(() => {console.log('db 연결 성공');})
.catch(console.error);

passportConfig();
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3050',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/user', userRouter);

app.listen(3055, () => {
  console.log('서버 실행중');
});