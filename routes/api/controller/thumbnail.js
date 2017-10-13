const _ = require('lodash');
const Thumbnail = require('../../../model/thumbnail');

exports.get_thumbnail = function(req, res) {
    console.log(req.params);
    res.json({status: 200});
};

exports.add_thumbnail = function(req, res) {
    if(!_.isString(req.body.file_name) || !_.isString(req.body.rel_path))
        return res.handle_error(new Error('missing parameter'));

    Thumbnail.create({file_name: req.body.file_name, rel_path: req.body.rel_path})
    .then((thumb) => {
        res.json({status: 200, thumbnail_id: thumb._id});
    })
    .catch(res.handle_error);
};

exports.update_thumbnail = function(req, res) {
    console.log(req.params);
    res.json({status: 200});
};