const mongoose = require('mongoose');

const Idea = mongoose.Schema({
    user: {type: String, required: true},
    title: {type: String, required: true},
    details: {type: String, required: true},
    created_at: { type: Date, default: Date.now("<YYYY-mm-dd>") },
});

module.exports = mongoose.model('Ideas', Idea);
