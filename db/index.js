var mysql = require('mysql');

var connection = mysql.createConnection({
  host:	'localhost',
  user:	'karte',
  password:	'hoge',
  database:	'karte'
});

module.exports = connection;
