var app = require('./config/express')();
var passport = require('./config/passport')(app);

// AUTH
var auth = require('./routes/auth')(passport);
app.use('/auth', auth);

//byl = HOME & FLOWER & TRAVEL & OTHER
var byl = require('./routes/byl')();
app.use('/byl', byl);

//connection
app.listen(8001, function(){
  console.log('Connected 8001 port!')
});
