require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
app.use(express.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "./views"));
const { isLogged } = require('./middleware/authMidd');

//Routes
app.get('/', isLogged, (req, res) => {
    res.render('main',{user:req.user});
});
app.use('/auth', require('./routes/authR'));
app.use('/users', isLogged, require('./routes/usersR'));
app.use('/categories', isLogged, require('./routes/categoryR'));

//Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});