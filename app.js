const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const exphbs  = require('express-handlebars');

const port = process.env.PORT || 3000;

// passport config
require('./config/passport-config')(passport);

// bootstrap database connection
const { database } = require('./database');
const ideas = require('./controllers/ideas');
const users = require('./controllers/users');

const app = express();

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// index route
app.get('/', (req, res) => res.render('index', {title: 'Video Ideas'}));

// about page
app.get('/about', (req, res) => res.render('about', {title: 'About'}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/ideas', ideas);
app.use('/users', users);



app.listen(port, () => console.log(`Server running on port ${port}`));
