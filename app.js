// ************* Importing packages ********
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const app = express();

// *********** View engine *********
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// ************ Middleware *********
app.use(helmet());      //for header protection
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// *********** Functions **************
// middleware to verify user
function checkUser(req, res, next) {
    const token = req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                //token is wrong
                console.log(err);
                res.status(400).send('Invalid token');
            } else {
                // OK, decoding is done
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        //no token, return to homepage
        res.redirect('/');
    }    
}

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
app.get('/blog', checkUser, (req, res) => {   
    const years = [2021, 2020, 2019];
    const posts = [
        {title: "aaa", detail: "AAA", year: 2021}, 
        {title: "bbb", detail: "BBB", year: 2020},
        {title: "ccc", detail: "CCC", year: 2019}
    ];
    // res.json(posts);
    res.render('blog', {year: years, post: posts});
});

// ======= Other routes ==========
// --- login ---
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username == "admin" && password == "1234") {
        //create JWT

        res.send("Login OK");
    }
    else {
        res.status(400).send("Login failed");
    }
});

// --- create jwt ---
app.get('/jwt', (req, res) => {
    // res.send(process.env.JWT_KEY);
    const payload = {userID: 1, username: 'admin'};
    const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '1d'});
    res.send(token);
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTI0MDY4OTgsImV4cCI6MTYxMjQ5MzI5OH0.hRxaU5qu_v4oPgUBJd0aCaWoNm0vMjXZmP0FKvVtjKc
});

// --- check jwt ---
app.get('/verify', (req, res) => {
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) {
            console.log(err);
            res.status(400).send('Invalid token');
        } else {
            // OK, decoding is done
            res.send(decoded);
        }
    });
});

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