const util = require('../../../../util');
const near = require('./near');

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
