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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../cards', 'build', 'index.html'));
});

app.listen(port, () =>
  console.log(`Cards listening on port ${port}!`),
);

