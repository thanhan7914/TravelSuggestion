const _ = require('lodash');
const Event = require('../../../model/event');
const Province = require('../../../model/province');
const util = require('../../../util');

exports.get_event_by_id = function(req, res) {
    if(!_.isString(req.params.event_id))
        return res.handle_error(new Error('missing parameter'));
    if(!req.isValidObjectId(req.params.event_id))
        return res.handle_error(new Error('invalid event id'));
    
    Event.findOne({_id: req.params.event_id})
    .populate('province')
    .then((event) => {
        res.json({status: 200, event});
    })
    .catch(res.handle_error);
};

exports.filter = function(req, res) {
    //copy url query to params
    util.inherit(req.query, req.params);
    //add params
    if(_.isUndefined(req.params.province_id))
        return res.json({status: 404, message: 'missing parameter province id'});
    /**
     * p: page
     * l: number record / page
     */

    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l)) l = 10;
    if(_.isNaN(s)) s = 0;

    var params = {
        province: req.params.province_id
    };

    var count = 0;

    if(util.hasattr(req.params, 'address'))
        params.address = new RegExp(util.cvv2regexp(req.params.address), 'i');
    if(util.hasattr(req.params, 'name'))
        params.event_name = new RegExp(util.cvv2regexp(req.params.name), 'i');
    if(util.hasattr(req.params, 'rating'))
        params.rating = _.toNumber(req.params.rating);

    if((!_.isUndefined(params.province) && !req.isValidObjectId(params.province)))
       return res.handle_error(new Error('invalid ObjectId'));

    Event.count(params)
    .then((c) => {
        count = c;

        return Event.find(params)
        .limit(l)
        .skip(s)
        .sort({event_name: 'asc'})
        .populate('province');
    })
    .then((events) => {
        res.json({status: 200, count, events});
    })
    .catch(res.handle_error);
};

exports.add_event = function(req, res) {
    if(!util.hasattr(req.body, ['event_name', 'address', 'detail', 'province_id', 'organization_day', 'organization']))
        return res.handle_error(new Error('missing parameter'));
    
    //check
    var params = {
        event_name: req.body.event_name,
        address: req.body.address,
        detail: req.body.detail,
        thumbnail: req.body.thumbnail,
        organization_day: req.body.organization_day,
        organization: req.body.organization,
        phone: '',
        tag: ''
    };

    if(_.isString(req.body.phone))
        params.phone = req.body.phone;
    if(_.isString(req.body.tag))
        params.tag = req.body.tag;

    return Province.findOne({_id: req.body.province_id})
    .then((province) => {
        if(_.isNull(province))
            throw new Error('Province not found');
        
        params.province = province._id;
        return Event.create(params);
     })
     .then((data) => {
        res.json({status: 200, inserted: data});
     })
     .catch(res.handle_error);
};

exports.remove = function(req, res) {
    if(!req.isValidObjectId(req.body.event_id))
        return res.handle_error(new Error('invalid event id'));
    
    Event.remove({_id: req.body.event_id})
    .then(res.done_task)
    .catch(res.handle_error);
};
