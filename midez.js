'use strict'

const mongoose = require('mongoose');
const util = require('./util');

module.exports = function(req, res, next) {
    req.query = util.parse_query_url(req.url);
    req.createObjectId = mongoose.Types.ObjectId;
    //attach function check validate ObjectId
    req.isValidObjectId = mongoose.Types.ObjectId.isValid;
    res.handle_error = function (error) {
        res.json({error: error.message});
    };
    res.array_dump = function(data) {
        res.json(data);
    };

    next();
};