const util = require('../../../../util');
const Place = require('../../../../model/place');
const Geo = require('./geo');
const near = require('./near');
const _ = require('lodash');

let getLatlng = function(province_id, select, limit)
{
    let places;

    return Place.find({province: province_id})
    .limit(limit)
    .select(select)
    .then((_places) => {
        places = JSON.parse(JSON.stringify(_places));
        let promise = [];

        places.forEach((place) => {
            promise.push(
                Geo.geoCode(place.address)
            );
        });

        return Promise.all(promise);
    })
    .then((geos) => {
        return places.map((val, idx) => {
            val.geo = geos[idx];

            return val;
        });
    });
};

exports.around = function(req, res) 
{
    //copy url query to params
    util.inherit(req.query, req.params);
    let _distance = 20000;

    if(typeof req.params.distance !== 'undefined')
        _distance = Number(req.params.distance);

    if(typeof req.params.latlng === 'undefined' &&
        typeof req.params.address === 'undefined' )
        return res.handle_error(new Error("Missing parameter latlng or address"));

    let line_follow;
    if(typeof req.params.address === 'string')
        line_follow = near.from_address(req.params.address, req.params.province_id, _distance);
    else
        line_follow = near.from_latlng(req.params.latlng, req.params.province_id, _distance);
    
    line_follow.then(res.array_dump)
    .catch(res.handle_error);
};


exports.latlng_around = function(req, res)
{
    util.inherit(req.query, req.params);

    let select = ['place_name', 'rating', 'tag', 'thumbnail', 'address'];
    let limit = 20;

    if(!util.hasattr(req.params, 'province_id'))
        return res.handle_error(new Error("missing parameter province id"));
    if(!_.isUndefined(req.params.limit))
        limit = Number(req.params.limit);
    if(!_.isUndefined(req.params.select))
        select = Array.prototype.slice.call(req.params.select);

    return getLatlng(req.params.province_id, select, limit)
    .then(res.array_dump)
    .catch(res.handle_error);
};
