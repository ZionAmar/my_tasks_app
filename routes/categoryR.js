const express = require('express');
const router = express.Router();
const categoryMidd = require('../middleware/categoryMidd.js');

router.get('/', categoryMidd.getAllCategories, (req, res) => {
    res.render('categories_list', {
        page_title: "ניהול קטגוריות",
        categories: req.categories,
    });
});

router.get('/add', (req, res) => {
    res.render('category_form', {
        page_title: "הוספת קטגוריה חדשה",
        category: {},
        error: null
    });
});

router.post('/add', categoryMidd.addCategory, (req, res) => {
    if (req.error) {
        res.render('category_form', {
            page_title: "הוספת קטגוריה חדשה",
            category: req.body,
            error: req.error
        });
    } else {
        res.redirect('/categories');
    }
});

router.get('/edit/:id', categoryMidd.getOneCategory, (req, res) => {
    if (!req.category) {
        return res.redirect('/categories');
    }
    res.render('category_form', {
        page_title: "עריכת קטגוריה",
        category: req.category,
        error: null
    });
});

router.post('/edit/:id', categoryMidd.updateCategory, (req, res) => {
    if (req.error) {
        req.body.id = req.params.id;
        res.render('category_form', {
            page_title: "עריכת קטגוריה",
            category: req.body,
            error: req.error
        });
    } else {
        res.redirect('/categories');
    }
});

router.post('/delete', categoryMidd.deleteCategory, (req, res) => {
    res.redirect('/categories');
});

module.exports = router;
