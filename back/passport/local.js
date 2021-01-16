const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const passportConfig = { 
  usernameField: 'email', 
  passwordField: 'password', 
};
const passportVerify = async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: { email }
    });
    if (!user) {
      return done(null, false, { reason: '이메일을 다시한번 확인해주세요.' });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return done(null, false, { reason: '비밀번호를 잘못입력하셨습니다..' });
    }
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
const JWTVerify = async (payload, done) => {
  try {
    console.log(payload);
    const user = await User.findOne({
      where: { id: payload.id }
    });
    if (!user) {
      return done(null, false, { reseon: '올바르지 않은 인증정보입니다.' });
    }
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
};

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};