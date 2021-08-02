const router = require('express').Router()
const { ensureAuthenticated } = require('../auth')
const { ensureNotAuth } = require('../auth2')
let Post = require('../models/post.model')

router.get('/', ensureNotAuth, (req, res) => {
    res.render('welcome');
})

//User's profile
router.get('/profile', ensureAuthenticated, (req, res) => {
    //Get username from authentication
    Post.find().sort({createdAt:-1})
        .then(posts => {
            const allPosts = posts.filter(post => {
                return post.username === req.user.username;
            })
            res.render('profile', {
                    posts: allPosts,
                    user: req.user
                });
            }) 
        .catch(err => console.log('Error found: ' + err));
})

module.exports = router;