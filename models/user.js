const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    joined_on: { type: Date, default: Date.now("<YYYY-mm-dd>") },
});

module.exports = mongoose.model('VideoIdeasUsers', User);
