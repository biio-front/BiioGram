const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.js');

const app = express();

const db = require('./models');
db.sequelize.sync()
.then(() => {console.log('db 연결 성공');})
.catch(console.error);

app.use(cors({
  origin: 'http://localhost:3055',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/user', userRouter);

app.listen(3055, () => {
  console.log('서버 실행중');
});