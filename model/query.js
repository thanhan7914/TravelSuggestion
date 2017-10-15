const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Query = Schema({
    keyword: {
        type: String,
        required: [true, 'key word']
    },
    n_fetch: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Query', Query);