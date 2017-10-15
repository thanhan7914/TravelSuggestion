const _ = require('lodash');
const Query = require('../../../model/query');
const FindResult = require('../../../model/findresult');
const Place = require('../../../model/place');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');
const Review = require('../../../model/review');
const insert_query = require('./query');
const util = require('../../../util');

module.exports = function(req, res) {
    res.json({status: 200});
};