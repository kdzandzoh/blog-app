const LocalStrategy = require('passport-local').Strategy
let User = require('./models/user.model')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            User.findOne({ username: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'This username does not exist' } );
                    }
                    if (password !== user.password) {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                    else {
                        return done(null, user);
                    }
                })  
                .catch(err => console.log('Error found: ' + err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
