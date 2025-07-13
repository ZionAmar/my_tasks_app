const db = require('../config/db');

const categoryMidd = {};

categoryMidd.getAllCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const sql = 'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC';
        const [categories] = await db.query(sql, [userId]);
        req.categories = categories;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

categoryMidd.getOneCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const sql = 'SELECT * FROM categories WHERE id = ? AND user_id = ?';
        const [categories] = await db.query(sql, [id, userId]);
        if (categories.length > 0) {
            req.category = categories[0];
        }
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

categoryMidd.addCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        if (!name || name.trim() === '') {
            req.error = 'שם הקטגוריה לא יכול להיות ריק.';
            return next();
        }
        const sql = 'INSERT INTO categories (name, user_id) VALUES (?, ?)';
        await db.query(sql, [name, userId]);
        req.success = true;
    } catch (err) {
        console.error(err);
        req.error = 'אירעה שגיאה בהוספת הקטגוריה.';
    }
    next();
};

categoryMidd.updateCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name } = req.body;
        if (!name || name.trim() === '') {
            req.error = 'שם הקטגוריה לא יכול להיות ריק.';
            return next();
        }
        const sql = 'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?';
        await db.query(sql, [name, id, userId]);
        req.success = true;
    } catch (err) {
        console.error(err);
        req.error = 'אירעה שגיאה בעדכון הקטגוריה.';
    }
    next();
};

categoryMidd.deleteCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { category_id } = req.body;
        const sql = 'DELETE FROM categories WHERE id = ? AND user_id = ?';
        await db.query(sql, [category_id, userId]);
    } catch (err) {
        console.error(err);
    }
    next();
};

module.exports = categoryMidd;
