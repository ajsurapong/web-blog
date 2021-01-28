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
    const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit. Egestas congue quisque egestas diam in arcu cursus. Nulla aliquet porttitor lacus luctus accumsan. Urna nec tincidunt praesent semper feugiat nibh sed. Volutpat maecenas volutpat blandit aliquam etiam. Eget nunc scelerisque viverra mauris in. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Ut pharetra sit amet aliquam id diam maecenas. Egestas quis ipsum suspendisse ultrices gravida. Enim nec dui nunc mattis enim ut tellus elementum sagittis.";
    res.render('index', {content: content});
});

// --- sign in ---
app.get('/signIn', (req, res) => {
    res.render('login');
});

// --- blog ---
app.get('/blog', (req, res) => {
    const years = [2021, 2020, 2019];
    const posts = [
        {title: "aaa", detail: "AAA", year: 2021}, 
        {title: "bbb", detail: "BBB", year: 2020},
        {title: "ccc", detail: "CCC", year: 2019}
    ];
    res.render('blog', {year: years, post: posts});
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