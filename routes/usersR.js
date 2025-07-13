const express = require('express');
const router = express.Router();
const userMidd = require('../middleware/userMidd.js');
const authMidd = require('../middleware/authMidd.js');

router.get('/', [userMidd.getAllUsers, authMidd.isAdmin], (req, res) => {
    res.render('user_list', {
        page_title: "רשימת משתמשים",
        users: req.users_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});

router.get('/edit/:id', userMidd.getOneUser, (req, res) => {
    if (req.user_data) {
        res.render('user_form', {
            page_title: "עריכת משתמש",
            user: req.user_data
        });
    } else {
        res.redirect('/users/list');
    }
});

router.post('/edit/:id', userMidd.updateUser, (req, res) => {
    res.redirect('/users/list');
});

router.post('/delete', [userMidd.getAllUsers, authMidd.isAdmin], (req, res) => {
    res.redirect('/users/list');
});


module.exports = router;
