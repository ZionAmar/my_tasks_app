const express = require('express');
const router = express.Router();
const taskMidd = require('../middleware/taskMidd.js');
const categoryMidd = require('../middleware/categoryMidd.js');

router.get('/', [taskMidd.getTasks, categoryMidd.getAllCategories], (req, res) => {
    res.render('tasks_page', {
        page_title: "ניהול משימות",
        tasks: req.tasks,
        categories: req.categories,
        page: req.page,
        total_pages: req.total_pages,
        filters: req.query
    });
});

router.get('/add', categoryMidd.getAllCategories, (req, res) => {
    res.render('task_form', {
        page_title: "הוספת משימה חדשה",
        categories: req.categories,
        error: null,
        task: {}
    });
});

router.post('/add', taskMidd.addTask, (req, res) => {
    if (req.error) {
        categoryMidd.getAllCategories(req, res, () => {
            res.render('task_form', {
                page_title: "הוספת משימה חדשה",
                categories: req.categories,
                error: req.error,
                task: req.body
            });
        });
    } else {
        res.redirect('/tasks');
    }
});

router.get('/edit/:id', taskMidd.getOneTask, categoryMidd.getAllCategories, (req, res) => {  
    if (req.task) {
        res.render('task_form', {
            page_title: "עריכת משימה",
            task: req.task,
            categories: req.categories,
            error: null
        });
    } else {
        res.redirect('/tasks');
    }
});

router.post('/edit/:id', taskMidd.updateTask, (req, res) => {
    if (req.error) {
        categoryMidd.getAllCategories(req, res, () => {
            res.render('task_form', {
                page_title: "עריכת משימה",
                task: { ...req.body, id: req.params.id },
                categories: req.categories,
                error: req.error
            });
        });
    } else {
        res.redirect('/tasks');
    }
});

router.post('/toggle/:taskId', taskMidd.toggleTaskStatus, (req, res) => {
    const returnUrl = req.header('Referer') || '/tasks';
    res.redirect(returnUrl);
});

router.post('/delete/:taskId', taskMidd.deleteTask, (req, res) => {
    res.redirect('/tasks');
});

module.exports = router;
