const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Province = Schema({
    province_name: {
        type: String,
        unique: true,
        required: [true, 'name of province']
    } 
});

module.exports = mongoose.model('Province', Province);