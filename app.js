// ************* Importing packages ********
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const con = require('./config/db');

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

// *********** Functions **************
// middleware to verify user
function checkUser(req, res, next) {
    const token = req.signedCookies['mytoken'] || req.headers['x-access-token'];
    if (token) {
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
    res.render('index', { content: content });
});

// --- sign in ---
app.get('/signIn', (req, res) => {
    res.render('login');
});

// --- blog ---
app.get('/blog', checkUser, (req, res) => {
    // get all years
    let sql = 'SELECT DISTINCT year FROM blog WHERE userID = ? ORDER BY year DESC';
    con.query(sql, [req.decoded.userID], (err, years) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        // get blog details of a user
        sql = 'SELECT blogID, title, detail, year FROM blog WHERE userID = ? ORDER BY year DESC';
        con.query(sql, [req.decoded.userID], (err, blogs) => {
            if(err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            // res.json({ users: req.decoded, year: years, post: blogs });
            res.render('blog', { users: req.decoded, year: years, post: blogs });
        });
    }); 
});


// --- blog for selected year ---
app.get('/blog/:year', checkUser, (req, res) => {
    const year = req.params.year;

    // get all years
    let sql = 'SELECT DISTINCT year FROM blog WHERE userID = ? ORDER BY year DESC';
    con.query(sql, [req.decoded.userID], (err, years) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        // get blog details of a user
        sql = 'SELECT blogID, title, detail, year FROM blog WHERE userID = ? AND year = ? ORDER BY year DESC';
        con.query(sql, [req.decoded.userID, year], (err, blogs) => {
            if(err) {
                console.log(err);
                return res.status(500).send('Database error');
            }
            // res.json({ users: req.decoded, year: years, post: blogs });
            res.render('blog', { users: req.decoded, year: years, post: blogs });
        });
    }); 
});

// ======= Other routes ==========
// --- generate hash password ---
app.get('/password/:pass', (req, res) => {
    const pass = req.params.pass;
    bcrypt.hash(pass, 10, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).send("Hashing error");
        }
        else {
            res.send(hash);
        }
    });
});

// --- login ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT userID, password FROM user WHERE username = ?';
    con.query(sql, [username], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database server error');
        }
        if (result.length != 1) {
            return res.status(400).send('Username does not exist');
        }
        //check password
        bcrypt.compare(password, result[0].password, (err, same) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Authen server error');
            }
            if (same) {
                //create JWT
                const payload = { userID: result[0].userID, username: username};
                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });

                // save token to client's cookie
                const cookieOption = {
                    maxAge: 24 * 60 * 60 * 1000,    //ms
                    httpOnly: true,
                    signed: true
                };
                res.cookie('mytoken', token, cookieOption);
                res.send('/blog');
            }
            else {
                res.status(400).send("Wrong password");
            }
        });
    });
});

// --- log out ---
app.get('/logout', (req, res) => {
    // remove token cookie
    res.clearCookie('mytoken');
    res.redirect('/');
});

// --- create jwt ---
app.get('/jwt', (req, res) => {
    // res.send(process.env.JWT_KEY);
    const payload = { userID: 1, username: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });
    res.send(token);
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTI0MDY4OTgsImV4cCI6MTYxMjQ5MzI5OH0.hRxaU5qu_v4oPgUBJd0aCaWoNm0vMjXZmP0FKvVtjKc
});

// --- check jwt ---
app.get('/verify', (req, res) => {
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
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