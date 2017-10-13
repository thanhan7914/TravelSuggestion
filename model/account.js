const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Account = Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'username']
    },
    password: {
        type: String,
        required: [true, 'password']
    } 
});

module.exports = mongoose.model('Account', Account);