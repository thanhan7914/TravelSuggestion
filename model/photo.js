const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Photo = Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    },
    file_name: {
        type: String,
        required: true
    },
    rel_path: {
        type: String,
        required: [true, 'relative path']
    },
    up_time: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Photo', Photo);