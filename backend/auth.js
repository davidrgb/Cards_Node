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

router.post('/signup', function (req, res, next) {
    connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function (err, row) {
        if (err) { return cb(err); }
        if (row[0]) { return res.json({ authenticated: false }); }
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
                    res.json({ authenticated: true });
                });
            });
        });
    });
});

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

router.post('/login/password',
    function (req, res, next) {
        passport.authenticate('local', function (err, user, info, status) {
            if (!user) return res.json({ authenticated: false });
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json({ authenticated: true });
            });
        })(req, res, next);
    }
);

router.get('/session', function (req, res) {
    if (req.session.passport === undefined || req.session.passport.user === undefined) return res.redirect('/login');
    else {
        let username = req.session.passport.user.username;
        if (username === undefined || username === null) return res.redirect('/login');
        else res.json({ message: 'Authenticated' });
    }
});

module.exports = router;