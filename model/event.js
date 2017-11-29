const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Event = Schema({
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
    thumbnail: {
        type: String,
        default: 'event_no_image.jpg'
    },
    event_name: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        default: "no describe"
    },
    organization_day: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    phone: String,
    tag: String
});

module.exports = mongoose.model('Event', Event);
