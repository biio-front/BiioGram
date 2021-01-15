const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password', 
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        console.log('이메일 틀림');
        return done(null, false, { reason: '이메일을 다시한번 확인해주세요.' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        console.log('비밀번호 틀림');
        return done(null, false, { reason: '비밀번호를 잘못입력하셨습니다..' });
      }
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};