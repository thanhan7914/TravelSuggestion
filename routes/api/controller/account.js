const _ = require('lodash');
const Account = require('../../../model/account');

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

    Account.create({username: req.body.username, password: req.body.password})
    .then((account) => {
        res.json({status: 200, account});
    })
    .catch(res.handle_error);
};