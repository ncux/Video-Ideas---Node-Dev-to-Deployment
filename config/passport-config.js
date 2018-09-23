const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// secret keys
const keys = require('./keys');

// database models
const User = require('../models/user');
const Idea = require('../models/idea');

// export the auth strategy
module.exports = function (passport) {
    passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => {
       let user = await User.findOne({email: email});
       if (!user) return done(null, false, {message: 'User not found!'});
       bcrypt.compare(password, user.password, (err, isMatch) => {
           if (err) throw err;
           if (isMatch) {
               return done(null, user);
           } else {
               return done(null, false, {message: 'Incorrect password. Try again!'});
           }
       });
    }));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};


