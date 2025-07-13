const db = require('../config/db');

const taskMidd = {};
const TASKS_PER_PAGE = 10;

taskMidd.getTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.p ? parseInt(req.query.p) : 0;
        const offset = page * TASKS_PER_PAGE;

        const statusFilter = req.query.status || 'all';
        const categoryFilter = req.query.category || 'all';

        let params = [userId];
        let whereClauses = ['t.user_id = ?'];

        if (statusFilter === 'completed') {
            whereClauses.push('t.is_completed = TRUE');
        } else if (statusFilter === 'pending') {
            whereClauses.push('t.is_completed = FALSE');
        }

        if (categoryFilter !== 'all') {
            whereClauses.push('t.category_id = ?');
            params.push(categoryFilter);
        }

        const whereSql = whereClauses.join(' AND ');

        const countSql = `SELECT COUNT(*) as total FROM tasks t WHERE ${whereSql}`;
        const [countRows] = await db.query(countSql, params);
        const totalTasks = countRows[0].total;
        
        req.total_pages = Math.ceil(totalTasks / TASKS_PER_PAGE);
        req.page = page;

        const tasksSql = `
            SELECT t.*, c.name as category_name 
            FROM tasks t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE ${whereSql}
            ORDER BY t.due_date IS NULL, t.due_date ASC
            LIMIT ? OFFSET ?
        `;
        
        const [tasks] = await db.query(tasksSql, [...params, TASKS_PER_PAGE, offset]);
        req.tasks = tasks;

        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

taskMidd.addTask = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { description, due_date, category_id } = req.body;

        if (!description || description.trim() === '') {
            req.error = 'תיאור המשימה לא יכול להיות ריק.';
            return next();
        }
        
        const sql = 'INSERT INTO tasks (description, due_date, category_id, user_id) VALUES (?, ?, ?, ?)';
        const category = category_id === 'none' ? null : category_id;
        const date = due_date || null;

        await db.query(sql, [description, date, category, userId]);
    } catch (err) {
        console.error(err);
        req.error = 'אירעה שגיאה בהוספת המשימה.';
    }
    next();
};

taskMidd.toggleTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.params;

        const sql = 'UPDATE tasks SET is_completed = NOT is_completed WHERE id = ? AND user_id = ?';
        await db.query(sql, [taskId, userId]);
    } catch (err) {
        console.error(err);
    }
    next();
};

taskMidd.deleteTask = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.params;

        const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
        await db.query(sql, [taskId, userId]);
    } catch (err) {
        console.error(err);
    }
    next();
};

module.exports = taskMidd;
