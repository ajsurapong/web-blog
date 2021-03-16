require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const con = require('../config/db');
const jwt = require('jsonwebtoken');
const checkUser = require('./checkUserMobile');

// --- validate token ---
// --- check jwt ---
router.get('/mobile/verify', (req, res) => {
    const token = req.headers['authorization'];
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

// --- login ---
router.post('/mobile/login', (req, res) => {
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
                
                res.send(token);
            }
            else {
                res.status(400).send("Wrong password");
            }
        });
    });
});

// --- blog ---
router.get('/mobile/blog', checkUser, (req, res) => {
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
            res.json({ users: req.decoded, year: years, post: blogs });
        });
    }); 
});

// --- blog for selected year ---
router.get('/mobile/blog/:year', checkUser, (req, res) => {
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
            res.json({ users: req.decoded, year: years, post: blogs });
        });
    }); 
});

// --- delete selected blog of a user ---
router.delete('/mobile/blog/:id', checkUser, (req, res) => {
    const blogID = req.params.id;
    const sql = 'DELETE FROM blog WHERE blogID = ? AND userID = ?';
    con.query(sql, [blogID, req.decoded.userID], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        if(result.affectedRows != 1) {
            return res.status(500).send('Delete failed');
        }
        res.send('Deleted');
    });
});

//  --- add new post ---
router.post('/mobile/blog/new', checkUser, (req, res) => {
    const title = req.body.title;
    const detail = req.body.detail;
    const year = new Date().getFullYear();
    
    const sql = 'INSERT INTO blog(userID, title, detail, year) VALUES(?, ?, ?, ?)';
    con.query(sql, [req.decoded.userID, title, detail, year], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        if(result.affectedRows != 1) {
            return res.status(500).send('Insert failed');
        }
        res.send('Added');
    });
});

//  --- edit a post ---
router.put('/mobile/blog/edit', checkUser, (req, res) => {
    const title = req.body.title;
    const detail = req.body.detail;
    const blogID = req.body.blogID;
    
    const sql = 'UPDATE blog SET title = ?, detail = ? WHERE blogID = ? AND userID = ?';
    con.query(sql, [title, detail, blogID, req.decoded.userID], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        if(result.affectedRows != 1) {
            return res.status(500).send('Insert failed');
        }
        res.send('Updated');
    });
});

module.exports = router;