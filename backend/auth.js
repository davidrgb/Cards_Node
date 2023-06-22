const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

const db = require('./db');

const router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('login');
})