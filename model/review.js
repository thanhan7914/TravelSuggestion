const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Review = Schema({
    _id: Schema.Types.ObjectId,
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
    }
});

module.exports = mongoose.model('Review', Review);