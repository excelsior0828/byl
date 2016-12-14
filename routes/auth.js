module.exports = function(passport){
  var conn = require('../config/db')();
  var route = require('express').Router();

  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/byl',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );
  route.get('/login', function(req, res){
    res.render('auth/login');
  });
  route.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      res.redirect('/byl');
    })
  });

  return route;
};
