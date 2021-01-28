// ************* Importing packages ********
const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// *********** View engine *********
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// ************ Middleware *********
app.use(helmet());      //for header protection
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// *********** Routes **************
// ======= Page routes ==========
// --- root ---
app.get('/', (req, res) => {
    res.render('index');
});

// --- sign in ---
app.get('/signIn', (req, res) => {
    res.render('login');
});

// --- blog ---
app.get('/blog', (req, res) => {
    res.render('blog');
});

// ======= Other routes ==========
// --- login ---
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username == "admin" && password == "1234") {
        res.send("Login OK");
    }
    else {
        res.status(400).send("Login failed");
    }
});

// 404, must be the last service
app.use((req, res) => {
    res.status(404).end();
});

// ************ Starting server ***********
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is staring at port " + PORT);
});