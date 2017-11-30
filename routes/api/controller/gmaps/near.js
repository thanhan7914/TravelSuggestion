const distance = require('./distance');
const _ = require('lodash');
const Place = require('../../../../model/place');
const Geo = require('./geo');

exports.from_latlng = function(latlng, province_id)
{
    return Geo(latlng).
    then((results) => {
        if(_.isNull(results))
            throw Error("not found");
        
        return exports.from_address(results[0].formatted_address, province_id);
    });
};

exports.from_address = function(address, province_id)
{
    return Place.find({province: province_id})
    .then((places) => {
        let promise = [];

        places.forEach((place) => {
            promise.push(
                distance(address, place.address)
            );
        });

        return Promise.all(promise);
    });
};
