const jwt = require('jsonwebtoken');
const md5 = require('md5');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const MD5_PEPPER = process.env.MD5_PEPPER;

const authMidd = {};

authMidd.registerUser = async (req, res, next) => {
    const { name, user_name, email, password, } = req.body;
    req.registerSuccess = false;
    if (!name || !user_name || !email || !password) {
        req.error = 'יש למלא את כל השדות';
        return next();
    }
    try {
        const hashedPassword = md5(MD5_PEPPER + password);
        const sql = 'INSERT INTO users (name, user_name, email, password_hash) VALUES (?,?,?,?)';
        await db.query(sql, [name, user_name, email, hashedPassword]);
        req.registerSuccess = true;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            req.error = 'אימייל זה כבר קיים במערכת';
        } else {
            req.error = 'אירעה שגיאה ברישום';
            console.error(err);
        }
    }
    next();
};

authMidd.checkLogin = async (req, res, next) => {
    const { user_name, password } = req.body;
    req.loginSuccess = false;
    if (!user_name || !password) {
        return next();
    }
    try {
        const hashedPassword = md5(MD5_PEPPER + password);

        const sql = 'SELECT * FROM users WHERE user_name = ? AND password_hash = ?';
        const [users] = await db.query(sql, [user_name, hashedPassword]);

        if (users.length > 0) {
            const user = users[0];
            const tokenPayload = { id: user.id, name: user.name, is_admin: user.is_admin };
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
            res.cookie('auth_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            req.loginSuccess = true;
        }
    } catch (err) {
        console.error(err);
    }
    next();
};

authMidd.isLogged = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('auth_token');
        return res.redirect('/auth/login');
    }
};

authMidd.isAdmin = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(403).send('<h1> אין לך הרשאת גישה לעמוד זה.</h1></br><a href="/">לדף הבית</a>');
    }
};

module.exports = authMidd;