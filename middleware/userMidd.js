const db = require('../config/db');

const userMidd = {};
const USERS_PER_PAGE = 10;

userMidd.getAllUsers = async (req, res, next) => {
    try {
        // חישוב עמוד נוכחי
        const page = req.query.p ? parseInt(req.query.p) : 0;
        const offset = page * USERS_PER_PAGE;

        // שאילתה לספירת כל המשתמשים (כדי לחשב מספר עמודים)
        const countSql = 'SELECT COUNT(*) as total FROM users';
        const [countRows] = await db.query(countSql);
        const totalUsers = countRows[0].total;
        req.total_pages = Math.ceil(totalUsers / USERS_PER_PAGE);
        req.page = page;

        // שאילתה לשליפת המשתמשים לעמוד הנוכחי
        const usersSql = 'SELECT id, name, user_name, email FROM users LIMIT ? OFFSET ?';
        const [users] = await db.query(usersSql, [USERS_PER_PAGE, offset]);
        
        req.users_data = users;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

userMidd.getOneUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT id, name, user_name, email FROM users WHERE id = ?';
        const [users] = await db.query(sql, [id]);

        if (users.length > 0) {
            req.user_data = users[0];
        }
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

userMidd.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, user_name, email } = req.body;
        
        const sql = 'UPDATE users SET name = ?, user_name = ?, email = ? WHERE id = ?';
        await db.query(sql, [name, user_name, email, id]);
        
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

userMidd.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.body;
        const sql = 'DELETE FROM users WHERE id = ?';
        await db.query(sql, [id]);
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = userMidd;
