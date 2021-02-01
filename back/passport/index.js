const passport = require('passport');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => { 
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      done(null, {id}); // req.user.id
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  
  local();
};