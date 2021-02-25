// middleware to verify user
require('dotenv').config();
const jwt = require('jsonwebtoken');

const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit. Egestas congue quisque egestas diam in arcu cursus. Nulla aliquet porttitor lacus luctus accumsan. Urna nec tincidunt praesent semper feugiat nibh sed. Volutpat maecenas volutpat blandit aliquam etiam. Eget nunc scelerisque viverra mauris in. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Ut pharetra sit amet aliquam id diam maecenas. Egestas quis ipsum suspendisse ultrices gravida. Enim nec dui nunc mattis enim ut tellus elementum sagittis.";

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
        // res.redirect('/home');
        res.render('index', { content: content, navbar: true });
    }
}

module.exports = checkUser;