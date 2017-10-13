const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Place = Schema({
    _id: Schema.Types.ObjectId,
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Thumbnail'
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
    place_name: String,
    phone: String,
    tag: String,
    address: String,
    rating: Number,
    detail: String
});

module.exports = mongoose.model('Place', Place);