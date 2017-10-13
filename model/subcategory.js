const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SubCategory = Schema({
    category: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Category'
    },
    sub_category_name: {
        type: String,
        require: 'need a name'
    }
});

module.exports = mongoose.model('SubCategory', SubCategory);