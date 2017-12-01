const _ = require('lodash');
const Event = require('../../../model/event');
const Province = require('../../../model/province');
const util = require('../../../util');

const GoogleMapsAPI = require('googlemaps');
const publicConfig = {
    key: 'AIzaSyD2tKEYkzH_23dAcPnXnbkBzcc_U26Gxxw',
    stagger_time:       1000,
    encode_polylines:   false,
    secure:             true
  };

const  gmAPI = new GoogleMapsAPI(publicConfig);

exports.get_event_by_id = function(req, res) {
    if(!_.isString(req.params.event_id))
        return res.handle_error(new Error('missing parameter'));
    if(!req.isValidObjectId(req.params.event_id))
        return res.handle_error(new Error('invalid event id'));
    
    let event;

    Event.findOne({_id: req.params.event_id})
    .populate('province')
    .then((_event) => {
        event = _event;

        return new Promise((r, rj) => {
            // geocode API
            const geocodeParams = {
                "address":    event.address,
                "components": "components=country:VN",
                "language":   "en",
                "region":     "vn"
            };
              
            gmAPI.geocode(geocodeParams, function(err, result){
                 if(err) rj(err);
                 r(result.results[0]);
            });
        });
    })
    .then((geo) => {
        res.json({status: 200, event, geo});
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

    var params = {};

    var count = 0;

    if(util.hasattr(req.params, 'address'))
        params.address = new RegExp(util.cvv2regexp(req.params.address), 'i');
    if(util.hasattr(req.params, 'name'))
        params.event_name = new RegExp(util.cvv2regexp(req.params.name), 'i');
    if(util.hasattr(req.params, 'rating'))
        params.rating = _.toNumber(req.params.rating);

    if(!_.isUndefined(req.params.province_id) && req.isValidObjectId(req.params.province_id))
       params.province = req.params.province_id;

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

exports.update = function(req, res) {
    if (!util.hasattr(req.body, ['event_id']))
        return res.handle_error(new Error('missing parameter event id'));

    Event.findById(req.body.event_id, function(err, params) {
        if (err)
            return res.handle_error(err);

        if (_.isString(req.body.thumbnail))
            params.thumbnail = req.body.thumbnail;
        if (_.isString(req.body.phone))
            params.phone = req.body.phone;
        if (_.isString(req.body.tag))
            params.tag = req.body.tag;
        if (_.isString(req.body.event_name))
            params.event_name = req.body.event_name;
        if (_.isString(req.body.address))
            params.address = req.body.address;
        if (_.isString(req.body.detail))
            params.detail = req.body.detail;
        if (_.isString(req.body.province_id))
            params.province = req.body.province_id;
        if (_.isString(req.body.organization_day))
            params.organization_day = req.body.organization_day;
        if (_.isString(req.body.organization))
            params.organization = req.body.organization;

        params.save(function(err2, doc) {
            if (err2) return res.handle_error(errs);
            res.json({
                status: 200,
                updated: doc
            });
        });
    });
};
