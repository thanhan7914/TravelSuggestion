const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Province = Schema({
    _id: Schema.Types.ObjectId,
    province_name: {
        type: String,
        required: [true, 'name of province']
    } 
});

module.exports = mongoose.model('Province', Province);