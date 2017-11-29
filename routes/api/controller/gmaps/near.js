const distance = require('./distance');
const _ = require('lodash');
const Place = require('../../../../model/place');

module.exports = function(address, province_id)
{
    Place.find({province: province_id})
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
