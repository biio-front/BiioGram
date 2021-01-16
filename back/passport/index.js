const passport = require('passport');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
  });

  local();
};