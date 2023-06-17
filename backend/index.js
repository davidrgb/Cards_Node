const express = require('express');
const path = require('path');

const app = express();

const port = 3010;

const mysql = require('mysql');

const credentials = require('./credentials.json');

const connection = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
});

app.use(express.static(path.resolve(__dirname, '../cards/build')));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test message.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../cards/build', 'index.html'));
});

app.listen(port, () =>
  console.log(`Cards listening on port ${port}!`),
);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});