const util = require('../../../../util');
const near = require('./near');

exports.around = function(req, res) 
{
    //copy url query to params
    util.inherit(req.query, req.params);
    //
    let line_follow;
    if(typeof req.params.address === 'string')
        line_follow = near.from_address(req.params.address, req.params.province_id);
    else
        line_follow = near.from_latlng(req.params.latlng, req.params.province_id);
    
    line_follow.then(res.array_dump)
    .catch(res.handle_error);
};
