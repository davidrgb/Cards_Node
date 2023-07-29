const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

const connection = require('./db');

const router = express.Router();

passport.use(new LocalStrategy(function verify(username, password, cb) {
    connection.query('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        if (err) { return cb(err); }
        if (!row[0]) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, Buffer.from(row[0].salt, 'hex'), 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(Buffer.from(row[0].hash, 'hex'), hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row[0]);
        });
    });
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const utility = require('./utility');

router.post('/signup', function (req, res, next) {
    if (!utility.validateUsername(req.body.username)) return res.status(utility.Status.BadRequest).json({ error: utility.usernameError(req.body.username) });
    if (!utility.validatePassword(req.body.password)) return res.status(utility.Status.BadRequest).json({ error: utility.passwordError(req.body.password) });
    connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (err, row) {
        if (err) { return cb(err); }
        if (row[0]) { return res.status(utility.Status.BadRequest).json({ error: 'Username is not available' }); }
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return next(err); }
            connection.query('INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)', [
                req.body.username,
                hashedPassword.toString('hex'),
                salt.toString('hex')
            ], function (err) {
                if (err) { return next(err); }
                var user = {
                    id: this.lastID,
                    username: req.body.username
                };
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    return res.status(utility.Status.Created).json({});
                });
            });
        });
    });
});

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(utility.Status.OK).redirect('/login');
    });
});

router.post('/login/password', function (req, res, next) {
    if (!utility.validateUsername(req.body.username)) return res.status(utility.Status.BadRequest).json({ error: utility.usernameError(req.body.username) });
    if (!utility.validatePassword(req.body.password)) return res.status(utility.Status.BadRequest).json({ error: utility.passwordError(req.body.password) });
    passport.authenticate('local', function (err, user, info, status) {
        if (!user) return res.status(utility.Status.BadRequest).json({ error: 'Incorrect username or password' });
        req.login(user, function (err) {
            if (err) { return next(err); }
            return res.status(utility.Status.OK).json({});
        });
    })(req, res, next);
}
);

router.get('/session', function (req, res) {
    if (req.session.passport === undefined || req.session.passport.user === undefined) return res.status(utility.Status.Unauthorized).redirect('/login');
    else {
        let username = req.session.passport.user.username;
        if (username === undefined || username === null) return res.status(utility.Status.Unauthorized).redirect('/login');
        else res.status(utility.Status.OK).json({});
    }
});

module.exports = router;