const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const bcrypt = require('bcryptjs');

const router = express.Router();

// User model
const User = require('../models/user');

// session keys
const keys = require('../config/keys');

// express-session middleware
router.use(session({
    secret: keys.sessionCookieKey,
    resave: true,
    saveUninitialized: true,
}));

// connect flash middleware
router.use(flash());

// global variables for flash messages
router.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Login page
router.get('/login', (req, res) => res.render('users/login', {title: 'Login'}));

// login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

// Register page
router.get('/register', (req, res) => res.render('users/register', {title: 'Register'}));

// registration form submit
router.post('/register', async (req, res) => {
   // console.log(req.body);
    // 1st validate user input
    let errors = [];
    if (req.body.password != req.body.password2) errors.push({message: 'Passwords do not match!'});
    if (req.body.password.length < 6) errors.push({message: 'Password is too short! Minimum 6 characters.'});
    if (errors.length > 0) {
        res.render('users/register', {errors: errors, name: req.body.name, email: req.body.email});
    } else {
        // 1st check if user email is not already registered
       let user = await User.findOne({email: req.body.email});
       if (user) {
           req.flash('error_message', 'Email is already registered! Try logging in.');
           res.redirect('/users/login');
       }
       else {   // then hash password and save user info to database
           try {
               let new_user = new User({name: req.body.name, email: req.body.email, password: req.body.password});
               await bcrypt.genSalt(10, (error, salt) => {
                   bcrypt.hash(req.body.password, salt, (error, hash) => {
                       if (error) console.log(error);
                       new_user.password = hash;
                       new_user.save();
                       req.flash('success_message', 'You successfully registered! Use your credentials to login.');
                       res.redirect('/users/login');
                   });
               });

           } catch (e) {
               console.log(e);
           }
       }


    }

});







module.exports = router;

