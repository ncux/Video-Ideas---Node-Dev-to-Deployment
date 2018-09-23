const mongoose = require('mongoose');

// get access to the database URL
const keys = require('./config/keys');

mongoose.connect(keys.databaseURL, { useNewUrlParser: true }, err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to database!');
    }
});

module.exports = mongoose;
