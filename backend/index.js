const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

let passport = require('passport');
let session = require('express-session');
let cookieParser = require('cookie-parser');

app.use(cookieParser());

const MySQLStore = require('express-mysql-session')(session);

const dev = true;

const port = dev ? 3011 : 3010;

const sessionCookie = require('./session-cookie.json');

app.use(express.static(path.resolve(__dirname, '../cards/build')));
app.use(express.static('public'));

const connection = require('./db.js');
const sessionStore = new MySQLStore({}, connection);

app.use(session({
  key: sessionCookie.key,
  secret: sessionCookie.secret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));


app.use(passport.authenticate('session'));

let authRouter = require('./auth');
app.use('/', authRouter);

app.post('/api/create/deck', (req, res) => {
  if (req.session.passport === undefined) return res.json({ error: 'Failed to create deck: authentication failure' });
  let username = req.session.passport.user.username;
  connection.query('select uuid()', function (err, row) {
    let id = row[0]['uuid()'];
    connection.query('INSERT INTO decks (owner, id, title, description) VALUES (?, ?, ?, ?)', [
      username,
      id,
      req.body.title,
      req.body.description,
    ], function (err) {
      if (err) return;
      return res.json({ username: username, id: id });
    })
  });
});

app.get('/api/deck/:deckId', function (req, res) {
  if (req.session.passport === undefined) return res.json({ error: 'Failed to read deck: authentication failure' });
  connection.query('SELECT * FROM decks WHERE id = ? LIMIT 1', [req.params.deckId], function (err, row) {
    let deck = row[0];
    return res.json({ 
      owner: deck['owner'],
      id: deck['id'],
      title: deck['title'],
      description: deck['description'],
      ts: deck['ts']
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../cards', 'build', 'index.html'));
});

app.listen(port, () =>
  console.log(`Cards listening on port ${port}!`),
);

