const router = require('express').Router()
const { ensureAuthenticated } = require('../auth')
let Post = require('../models/post.model')

//List all the posts
router.get('/', (req, res) => {
    Post.find().sort({createdAt:-1})
        .then(posts => {
            res.render('posts', {
                posts: posts,
                user: req.user
            });
        }) 
        .catch(err => console.log('Error found: ' + err));
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('newPost');
})

//Add a post
router.post('/add', (req, res) => {
    const body = req.body.body;
    let errors = [];
    if (!body) {
        errors.push({ msg:'Please fill all the fields' });
        res.render('newPost', { errors });
    }
    const new_post = new Post({body, username: req.user.username});
    new_post.save()
        .then(post => {
            req.flash('success_msg', 'New post added!')
            res.redirect('/posts')
        })
        .catch(err => console.log('Error found:' + err));
})

//New comment
router.get('/:id', ensureAuthenticated, (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.render('newComment', {post}))
        .catch(err => console.log('Error found: ' + err));
})

router.post('/:id', (req, res) => {
    const body = req.body.body;
    let errors = [];
    if (!body) {
        errors.push({ msg:'Please fill all the fields' });
        res.render('newComment', { errors });
    }
    const new_comment = {body, username: req.user.username};
    Post.findById(req.params.id)
        .then(post => {
            post.username = post.username;
            post.likes = post.likes;
            post.body = post.body;
            post.comments.push(new_comment);
            post.comments = post.comments;

            post.save()
                .then(() => {
                    req.flash('success_msg', 'Comment added!')
                    res.redirect('/posts')
                })
                .catch(err => console.log('Error found:' + err));
        })
        .catch(err => console.log('Error found: ' + err));
})

//Get comments
router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            const comment = post.comments;
            res.render('comments', { comment, post, user:req.user })
        })
        .catch(err => console.log('Error found: ' + err));
})

//Delete comments
router.get('/:id/comments/d', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            const comments = post.comments;
            let array = [];
            comments.forEach(comment => {
                if (comment._id !== '5ff3a6d2aa57fe70f014ee4e') {
                    array.push(comment);
                }
            });
            post.username = post.username;
            post.likes = post.likes;
            post.body = post.body;
            post.comments = array;

            post.save()
                .then(() => {
                    req.flash('success_msg', 'Comment removed!')
                    res.redirect('/posts')
                })
                .catch(err => console.log('Error found:' + err));

        })
        .catch(err => console.log('Error found: ' + err));
})

//Delete post
router.get('/:id/delete', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/posts'))
        .catch(err => console.log('Error found: ' + err));
})

module.exports = router;


