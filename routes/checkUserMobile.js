// middleware to verify user
require('dotenv').config();
const jwt = require('jsonwebtoken');

function checkUser(req, res, next) {
    const token = req.headers['authorization'] || req.headers['x-access-token'];
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
        //no token
        res.status(400).send('no token');
    }
}

module.exports = checkUser;