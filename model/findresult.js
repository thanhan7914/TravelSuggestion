const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FindResult = Schema({
    query: {
        type: Schema.Types.ObjectId,
        ref: 'Query'
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    } 
});

module.exports = mongoose.model('FindResult', FindResult);