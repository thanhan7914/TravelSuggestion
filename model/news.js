const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var News = Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    thumbnail: {
        type: String,
        default: 'news_no_image.jpg'
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
    title: String,
    content: String,
    tag: String,
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('News', News);