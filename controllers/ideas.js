const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const router = express.Router();

// method override
const mor = require('method-override');
router.use(mor('_method'));

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

    next();
});

// Idea model
const Idea = require('../models/idea');


// get add idea form [OK!]
router.get('/add', checkIfAuthenticated, (req, res) => res.render('ideas/add'));

// get update idea form [OK!]
router.get('/update/:id', checkIfAuthenticated, async (req, res) => {
    try {
        let idea = await Idea.findById(req.params.id);
        if (idea.user != req.user.id) res.redirect('/ideas');
        else res.render('ideas/update', {idea: idea});
    } catch (e) {
        res.status(500).send(e, 'Failed to retrieve idea from the database!');
    }
});

// get all ideas [OK!]
router.get('/', async (req, res) => {
    try {
        let ideas = await Idea.find({user: req.user.id}).sort({date: -1});
        res.render('ideas/ideas', {ideas: ideas});
    } catch (e) {
        res.status(500).send(e, 'Failed to retrieve ideas from the database!');
    }
});

// create an idea [OK!]
router.post('/', checkIfAuthenticated, async (req, res) => {
    let errors = [];
    console.log(req.body);
    if (!req.body.title) {errors.push({message: 'Title is required!'})}
    if (!req.body.details) {errors.push({message: 'Details are required!'})}
    if (errors.length > 0) {
        res.render('ideas/add', {errors: errors, title: req.body.title, details: req.body.details});
    } else {
       let idea = new Idea({user: req.user.id, title: req.body.title, details: req.body.details});
        try {
            await idea.save();
            req.flash('success_message', 'Video idea was successfully added!');
            res.redirect('/ideas');
        } catch (e) {
            res.status(500).send(e, 'Failed to add idea!');
        }
    }
});

// update an idea [0K!]
router.put('/:id', checkIfAuthenticated, async (req, res) => {
    try {
        await Idea.findByIdAndUpdate(req.params.id, {title: req.body.title, details: req.body.details});
        req.flash('success_message', 'Video idea was successfully updated!');
        res.redirect('/ideas');
    } catch (e) {
        res.status(500).send(e, 'Failed to update idea!');
    }
});

// delete an idea
router.delete('/delete/:id', checkIfAuthenticated, async (req, res) => {
    let idea = await Idea.findById(req.params.id);
    if (idea.user != req.user.id) res.redirect('/ideas');
    else {
        try {
            await Idea.deleteOne(idea);
            req.flash('success_message', 'Video idea was successfully deleted!');
            res.redirect('/ideas');
        } catch (e) {
            res.status(500).send(e, 'Failed to delete idea from the database!');
        }
    }
});

// authentication guard
function checkIfAuthenticated(req, res, next) {
    if (!req.isAuthenticated())  res.redirect('/users/login');
    else next();
}


module.exports = router;
