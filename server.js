require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const jwt = require('jsonwebtoken');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "./views"));
const { isLogged } = require('./middleware/authMidd');

//הוספת מידלוור לזיהוי נוח של המשתמש תמיד בצד הלקוח כל עוד והוא מחובר
app.use((req, res, next) => {
    const token = req.cookies.auth_token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

//Routes
app.get('/', isLogged, (req, res) => {res.render('main',{user:req.user});});
app.use('/auth', require('./routes/authR'));
app.use('/users', isLogged, require('./routes/usersR'));
app.use('/categories', isLogged, require('./routes/categoryR'));
app.use('/tasks', isLogged, require('./routes/taskR'));

//Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});