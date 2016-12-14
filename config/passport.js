module.exports = function(app){
  var conn = require('./db')();
  var bkfd2Password = require('pbkdf2-password');
  var hasher = bkfd2Password();
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
  });
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, user){
      if(err){
        console.log(err);
        done('There is no user.');
      } else {
        console.log('results', user);
        done(null, user);
      }
    });
  });
  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [uname], function(err, results){
        console.log(results);
        console.log(err);
        if(err){
          done(err);
        } else {
          if(results.length === 0) {
            console.log('User not found');
            return done(null, false);
          }
          var user = results[0];
          return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
            if(hash === user.password){
              console.log('LocalStrategy', user);
              done(null, user);
            } else {
              done(null, false);
            }
         });
        }
      });
    }
  ));
  return passport;
}
