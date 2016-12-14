module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'gksdnf9450',
    database : 'blossom'
  });
  conn.connect();
  return conn;
}
