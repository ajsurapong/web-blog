const router = require('express').Router();
const checkUser = require('./checkUser');
const con = require('../config/db');

// --- blog ---
router.get('/blog', checkUser, (req, res) => {
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
router.get('/blog/:year', checkUser, (req, res) => {
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
            res.render('blog', { users: req.decoded, year: years, post: blogs, currentYear: year });
        });
    }); 
});

// --- delete selected blog of a user ---
router.delete('/blog/:id', checkUser, (req, res) => {
    const blogID = req.params.id;
    const sql = 'DELETE FROM blog WHERE blogID = ?';
    con.query(sql, [blogID], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        if(result.affectedRows != 1) {
            return res.status(500).send('Delete failed');
        }
        res.send('/blog');
    });
});

//  --- add new post ---
router.post('/blog/new', checkUser, (req, res) => {
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
        res.send('/blog');
    });
});

//  --- edit a post ---
router.put('/blog/edit', checkUser, (req, res) => {
    const title = req.body.title;
    const detail = req.body.detail;
    const blogID = req.body.blogID;
    
    const sql = 'UPDATE blog SET title = ?, detail = ? WHERE blogID = ?';
    con.query(sql, [title, detail, blogID], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        if(result.affectedRows != 1) {
            return res.status(500).send('Insert failed');
        }
        res.send('/blog');
    });
});

module.exports = router;