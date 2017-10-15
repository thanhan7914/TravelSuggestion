const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Place = Schema({
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
    thumbnail: {
        type: String,
        default: 'place_no_image.jpg'
    },
    place_name: {
        type: String,
        unique: true,
        required: true
    },
    phone: String,
    tag: String,
    address: {
        type: String,
        required: true
    },
    rating: Number,
    detail: {
        type: String,
        default: "no describe"
    }
});

module.exports = mongoose.model('Place', Place);