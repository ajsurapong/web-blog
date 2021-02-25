const router = require('express').Router();
const checkUser = require('./checkUser');
const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit. Egestas congue quisque egestas diam in arcu cursus. Nulla aliquet porttitor lacus luctus accumsan. Urna nec tincidunt praesent semper feugiat nibh sed. Volutpat maecenas volutpat blandit aliquam etiam. Eget nunc scelerisque viverra mauris in. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Ut pharetra sit amet aliquam id diam maecenas. Egestas quis ipsum suspendisse ultrices gravida. Enim nec dui nunc mattis enim ut tellus elementum sagittis.";

// --- root ---
router.get('/', checkUser, (req, res) => {    
    res.render('index', { content: content });
});

// --- sign in ---
router.get('/signIn', (req, res) => {
    res.render('login');
});

module.exports = router;