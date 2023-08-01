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

const package = require('./package.json');

require('dotenv').config()

const port = process.env.STATUS === 'production' ? process.env.PROD_PORT : process.env.DEV_PORT;

const sessionCookie = require('./session-cookie.json');

app.use(express.static(path.resolve(__dirname, '../cards/build')));

const connection = require('./db.js');
const sessionStore = new MySQLStore({}, connection);

app.use(session({
  key: sessionCookie.key,
  secret: sessionCookie.secret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
}));


app.use(passport.authenticate('session'));

let authRouter = require('./auth');
app.use('/', authRouter);

const utility = require('./utility');

app.post('/api/create/deck', (req, res) => {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to create deck: authentication failure' });
  let username = req.session.passport.user.username;
  if (!utility.validateTitle(req.body.title)) return res.status(utility.Status.BadRequest).json({ error: utility.titleError(req.body.title) });
  if (!utility.validateDescription(req.body.description)) return res.status(utility.Status.BadRequest).json({ error: utility.descriptionError(req.body.description) });
  connection.query('select uuid()', function (err, row) {
    let id = row[0]['uuid()'];
    connection.query('INSERT INTO decks (owner, id, title, description) VALUES (?, ?, ?, ?)', [
      username,
      id,
      req.body.title,
      req.body.description,
    ], function (err) {
      if (err) return;
      return res.status(utility.Status.Created).json({ id: id });
    })
  });
});

app.get('/api/decks', function (req, res) {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to read deck: authentication failure' });
  let decks = [];
  connection.query('SELECT * FROM decks WHERE owner = ?', [req.session.passport.user.username], function (err, ownedDecks) {
    ownedDecks.forEach(deck => {
      decks.push(deck);
    });
    connection.query('SELECT * FROM shared_users WHERE username = ?', [req.session.passport.user.username], function (err, sharedDeckIDs) {
      if (sharedDeckIDs.length === 0) return res.status(utility.Status.OK).json(decks);
      sharedDeckIDs.forEach(sharedDeckID => {
        connection.query('SELECT * FROM decks WHERE id = ?', [sharedDeckID.deck_id], function (err, sharedDecks) {
          sharedDecks.forEach(deck => {
            decks.push(deck);
          });
          return res.status(utility.Status.OK).json(decks);
        });
      });
    });
  });

});

app.get('/api/deck/:deckId', function (req, res) {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to read deck: authentication failure' });
  connection.query('SELECT * FROM decks WHERE id = ? LIMIT 1', [req.params.deckId], function (err, row) {
    let deck = row[0];
    if (deck['owner'] === req.session.passport.user.username) {
      return res.status(utility.Status.OK).json({
        owner: deck['owner'],
        id: deck['id'],
        title: deck['title'],
        description: deck['description'],
        ts: deck['ts']
      });
    }
    connection.query('SELECT * FROM shared_users WHERE deck_id = ?', [deck['id']], function (err, sharedUsers) {
      let isSharedUser = false;
      sharedUsers.forEach(user => {
        if (user.username === req.session.passport.user.username) isSharedUser = true;
      });
      return isSharedUser
        ?
        res.status(utility.Status.OK).json({
          owner: deck['owner'],
          id: deck['id'],
          title: deck['title'],
          description: deck['description'],
          ts: deck['ts']
        })
        :
        res.status(utility.Status.BadRequest).json({ error: 'Failed to read deck: authentication failure' });
    });
  });
});

app.post('/api/update/deck/:deckId', function (req, res) {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to update deck: authentication failure' });
  if (!utility.validateTitle(req.body.title)) return res.status(utility.Status.BadRequest).json({ error: utility.titleError(req.body.title) });
  if (!utility.validateDescription(req.body.description)) return res.status(utility.Status.BadRequest).json({ error: utility.descriptionError(req.body.description) });
  connection.query('SELECT * FROM decks WHERE id = ? LIMIT 1', [req.params.deckId], function (err, row) {
    let deck = row[0];
    if (deck['owner'] === req.session.passport.user.username) {
      connection.query('UPDATE decks SET title = ?, description = ? WHERE id = ?',
        [req.body.title, req.body.description, req.params.deckId],
        function (err) {
          if (err) return res.status(utility.Status.InternalServerError).json({ error: err });
          return res.status(utility.Status.OK).json({});
        });
    }
    else return res.status(utility.Status.Forbidden).json({ error: 'Failed to update deck: authentication failure' });
  });
});

app.post('/api/delete/deck/:deckId', function (req, res) {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to delete deck: authentication failure' });
  connection.query('SELECT * FROM decks WHERE id = ? LIMIT 1', [req.params.deckId], function (err, row) {
    let deck = row[0];
    if (deck['owner'] === req.session.passport.user.username) {
      connection.query('DELETE FROM decks WHERE id = ?', [req.params.deckId], function (err) {
        if (err) return res.status(utility.Status.InternalServerError).json({ error: err });
        else return res.status(utility.Status.OK).json({});
      })
    }
    else return res.status(utility.Status.BadRequest).json({ error: 'Failed to delete deck: authentication failure' });
  });
});

app.get('/api/user', function (req, res) {
  if (req.session.passport === undefined) return res.status(utility.Status.Unauthorized).json({ error: 'Failed to read deck: authentication failure' });
  return res.status(utility.Status.OK).json({ username: req.session.passport.user.username });
});

app.get('/api/version', (req, res) => {
  return res.status(utility.Status.OK).json({ version: package.version });
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../cards', 'build', 'index.html'));
});

app.listen(port, () =>
  console.log(`Cards listening on port ${port}!`),
);

