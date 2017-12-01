const distance = require('./distance');
const _ = require('lodash');
const Place = require('../../../../model/place');
const Geo = require('./geo');
const util = require('../../../../util');

exports.from_latlng = function(latlng, province_id, _distance = 20000)
{
    return Geo(latlng).
    then((results) => {
        if(_.isNull(results))
            throw Error("not found");
        
        return exports.from_address(results[0].formatted_address, province_id, _distance);
    });
};

exports.from_address = function(address, province_id, _distance = 20000)
{
    let places;

    return Place.find({province: province_id})
    .then((_places) => {
        places = JSON.parse(JSON.stringify(_places));
        let promise = [];

        places.forEach((place) => {
            promise.push(
                distance(address, place.address)
            );
        });

        return Promise.all(promise);
    })
    .then((distances) => {
        let rs_places = places.map((val, idx) => {
            val.distance = distances[idx];

            try {
                if(!_.isUndefined(val.distance) &&
                    val.distance.rows.length > 0 &&
                    val.distance.rows[0].elements[0].distance.value < _distance
                )
                {
                    val.visible = true;

                    return val;
                }
            }
            catch(err){                
            }

            return {
                visible: false
            };
        });

        // rs_places.sort((a, b) => {
        //     return a.distance.rows[0].elements[0].distance.value > b.distance.rows[0].elements[0].distance.value;
        // });

        return rs_places.filter((val) => val.visible);
    });
};
