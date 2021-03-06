// ************* Importing packages ********
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const pageRoute = require('./routes/pageRoute');
const otherRoute = require('./routes/otherRoute');
const blogRoute = require('./routes/blogRoute');
const mobileRoute = require('./routes/mobileRoute');

const app = express();

// *********** View engine *********
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// ************ Middleware *********
app.use(compression());
app.use(helmet());      //for header protection
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_KEY));

// *********** Routes **************
// ======= Page routes ==========
app.use(pageRoute);

// ======= Other routes ==========
app.use(otherRoute);

// ======= Blog routes ==========
app.use(blogRoute);

// ======= Mobile routes ==========
app.use(mobileRoute);

// 404, must be the last service
app.use((req, res) => {
    // res.status(404).send("Oops, page is not found!");
    res.render('404');
});

// ************ Starting server ***********
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is staring at port " + PORT);
});