const mysql = require('mysql');
const credentials = require('./credentials.json');
const connection = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
  charset: 'utf8'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
});

module.exports = connection;