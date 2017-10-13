const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Thumbnail = Schema({
    _id: Schema.Types.ObjectId,
    file_name: {
        type: String,
        required: [true, 'name of file']
    },
    rel_path: {
        type: String,
        required: [true, 'relative path']
    } 
});

module.exports = mongoose.model('Thumbnail', Thumbnail);