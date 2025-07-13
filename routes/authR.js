const express = require('express');
const router = express.Router();
const { registerUser, checkLogin } = require('../middleware/authMidd');

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

router.post('/register', registerUser, (req, res) => {
    if (req.registerSuccess) {
        res.redirect('/auth/login');
    } else {
        res.render('register', { error: req.error });
    }
});

router.post('/login', checkLogin, (req, res) => {
    if (req.loginSuccess) {
        res.redirect('/');
    } else {
        res.render('login', { error: req.error });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.redirect('/auth/login');
});

module.exports = router;
