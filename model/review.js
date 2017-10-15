const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Review = Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    create_date: Date
});

module.exports = mongoose.model('Review', Review);