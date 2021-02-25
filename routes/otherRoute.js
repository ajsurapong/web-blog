require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const con = require('../config/db');
const jwt = require('jsonwebtoken');

// --- generate hash password ---
router.get('/password/:pass', (req, res) => {
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
router.post('/login', (req, res) => {
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
router.get('/logout', (req, res) => {
    // remove token cookie
    res.clearCookie('mytoken');
    res.redirect('/');
});

// --- create jwt ---
router.get('/jwt', (req, res) => {
    // res.send(process.env.JWT_KEY);
    const payload = { userID: 1, username: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' });
    res.send(token);
});

// --- check jwt ---
router.get('/verify', (req, res) => {
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

module.exports = router;