module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
  var app = express();
  app.locals.pretty = true;
  app.set('views', './views');
  app.set('view engine', 'jade');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/uploads', express.static("uploads"));
  app.use('/styles', express.static('styles'));
  app.use(session({
    secret: '0290f2ihn02p38hr023',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'gksdnf9450',
      database: 'blossom'
    })
  }));
  return app;
}
