const _ = require('lodash');
const Photo = require('../../../model/photo');
const Place = require('../../../model/place');

exports.get_list = function(req, res) {
    Photo.find({place: req.params.place_id})
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.add_photo = function(req, res) {
    if(!_.isString(req.body.file_name) || !_.isString(req.body.rel_path))
        return res.handle_error(new Error('missing parameter'));
    if(!req.isValidObjectId(req.body.place_id))
        return res.handle_error(new Error('ObjectId invalid'));
    
    Place.findOne({_id: req.body.place_id})
    .then((place) => {
        if(_.isNull(place) || _.isEmpty(place))
           throw new Error('Place not found');
        
        var photo = {
            place: place._id,
            file_name: req.body.file_name,
            rel_path: req.body.rel_path
        };

        return Photo.create(photo);
    })
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.remove_photo = function(req, res) {
    if(_.isUndefined(req.body.photo_id))
        return res.handle_error(new Error("missing parameter photo_id"));
    if(!req.isValidObjectId(req.body.photo_id))
        return res.handle_error(new Error('invalid photo id'));
        
    Photo.remove({_id: req.body.photo_id})
    .then(res.array_dump)
    .catch(res.handle_error);
};

