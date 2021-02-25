require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const con = require('../config/db');
const jwt = require('jsonwebtoken');

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

module.exports = router;