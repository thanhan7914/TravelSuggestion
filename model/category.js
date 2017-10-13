const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Category = Schema({
    category_name: {
        type: String,
        required: [true, 'name of category']
    }
});

module.exports = mongoose.model('Category', Category);