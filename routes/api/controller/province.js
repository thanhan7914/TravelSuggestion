const _ = require('lodash');
const Province = require('../../../model/province');

exports.get_list = function(req, res) {
    Province.find({})
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.add_province = function(req, res) {
    if(!_.isString(req.body.province_name))
       return res.handle_error(new Error('missing parameter'));

    Province.create({province_name: req.body.province_name})
    .then((province) => {
        res.json({status: 200, province_id: province._id, province_name: province.province_name});
    })
    .catch(res.handle_error);
};