const router = require('express').Router()
const passport = require('passport')
let User = require('../models/user.model')
const { ensureNotAuth } = require('../auth2')
const { ensureAuthenticated } = require('../auth')


//Register page
router.get('/register', ensureNotAuth, (req, res) => {
    res.render('register');
})

//Login page
router.get('/login', ensureNotAuth, (req, res) => {
    res.render('login');
})

//Register user
router.post('/register',(req, res) => {
    const { name, email, username, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !username || !password || !password2) {
        errors.push({ msg: 'Please fill all the fields '});
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters'});
    }
    if (password !== password2) {
        errors.push({ msg: 'The passwords do not match'});
    }
    if (errors.length > 0) {
        res.render('register', {
            errors, 
            name,
            email, 
            username
        });
    }
    else {
        User.findOne({ username })
            .then(user => {
                if (user) {
                    //User exists already
                    errors.push({ msg: 'This username is taken' });
                    res.render('register', {
                        errors, 
                        name,
                        email, 
                        username
                    });
                }
                else {
                    User.findOne({ email })
                        .then(user2 => {
                            if (user2) {
                                //User exists already
                                errors.push({ msg: 'This email is already registered' });
                                res.render('register', {
                                    errors, 
                                    name,
                                    email, 
                                    username
                                });
                            } 
                            else {
                                const user = new User({username, name, email, password});
                                user.save()
                                    .then(user => {
                                        req.flash('success_msg', 'Successfully registered!')
                                        res.redirect('/users/login')
                                    })
                                    .catch(err => console.log('Error found: ' + err));
                            }
                        })
                }
            })
            .catch(err => console.log('Error found: ' + err));
    }
})

//Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully logged out');
    res.redirect('/users/login');
});

module.exports = router;
