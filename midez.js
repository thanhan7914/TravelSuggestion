'use strict'

const mongoose = require('mongoose');
const util = require('./util');

module.exports = function(req, res, next) {
    // Attach header
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // function
    req.query = util.parse_query_url(req.url);
    req.createObjectId = mongoose.Types.ObjectId;
    //attach function check validate ObjectId
    req.isValidObjectId = mongoose.Types.ObjectId.isValid;
    res.done_task = function() {
        res.json({status: 200, message: 'task completion.'});
    };
    res.handle_error = function (error) {
        res.json({status: 404, error: error.message});
    };
    res.array_dump = function(data) {
        res.json(data);
    };

    next();
};