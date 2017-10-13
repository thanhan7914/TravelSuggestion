const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var News = Schema({
    _id: Schema.Types.ObjectId,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Thumbnail'
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
    title: String,
    content: String,
    tag: String,
    date: Date
});

module.exports = mongoose.model('News', News);