require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

//Routes
app.get('/', (req, res) => {
    res.send('<h1>Task Manager API is running!</h1>');
});
app.use('/users', require('./routes/usersR'));

//Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});