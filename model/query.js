const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Query = Schema({
    _id: Schema.Types.ObjectId,
    guid: {
        type: String,
        required: [true, 'guid of device']
    },
    keyword: {
        type: String,
        required: [true, 'key word']
    } 
});

module.exports = mongoose.model('Query', Query);