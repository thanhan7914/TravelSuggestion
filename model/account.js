const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Account = Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'username']
    },
    password: {
        type: String,
        required: [true, 'password']
    } 
});

module.exports = mongoose.model('Account', Account);