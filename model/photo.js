const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Photo = Schema({
    _id: Schema.Types.ObjectId,
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
    }
});

module.exports = mongoose.model('Photo', Photo);