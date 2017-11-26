const _ = require('lodash');
const Account = require('../../../model/account');
const util = require('../../../util');

exports.get_list = function(req, res) {
    Account.find({})
    .select('username')
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.add_account = function(req, res) {
    if(!_.isString(req.body.username) || !_.isString(req.body.password))
       return res.handle_error(new Error('missing parameter'));
    if(req.body.username.trim() === '' || req.body.password.trim() === '')
       return res.handle_error(new Error('username or password not empty'));

    Account.findOne({username: req.body.username})
    .select('username')
    .then((account) => {
        if(!_.isNull(account))
            throw new Error('Username exists.');
        
        return Account.create({username: req.body.username, password: req.body.password});
    })
    .then((account) => {
        res.json({status: 200, account});
    })
    .catch(res.handle_error);
};

exports.get_account = function(req, res) {
    util.inherit(req.query, req.params);

    if(!_.isString(req.params.username) || !_.isString(req.params.password))
        return res.handle_error(new Error('missing parameter'));
    if(req.params.username.trim() === '' || req.params.password.trim() === '')
        return res.handle_error(new Error('username or password not empty'));

    Account.findOne({username: req.params.username, password: req.params.password})
    .select('username')
    .then((account) => {
        if(_.isNull(account))
            throw new Error('Notfound account.');
        
        res.json({status: 200, account});
    })
    .catch(res.handle_error);
};
