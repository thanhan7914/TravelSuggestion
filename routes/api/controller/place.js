const _ = require('lodash');
const Place = require('../../../model/place');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');
const Review = require('../../../model/review');
const insert_query = require('./query');
const util = require('../../../util');
const Photo = require('../../../model/photo');

const GoogleMapsAPI = require('googlemaps');
const publicConfig = {
    key: 'AIzaSyD2tKEYkzH_23dAcPnXnbkBzcc_U26Gxxw',
    stagger_time:       1000,
    encode_polylines:   false,
    secure:             true
  };

const  gmAPI = new GoogleMapsAPI(publicConfig);

exports.get_reviews = function(req, res) {
    if(!req.isValidObjectId(req.params.place_id))
         return res.handle_error(new Error('invalid ObjectId'));
    
    var count = 0;

    return Review.count({place: req.params.place_id})
    .then((c) => {
        count = c;

        return Review.find({place: req.params.place_id})
        .populate('account', ['username']);
    })
    .then((reviews) => {
        res.json({status: 200, count, reviews});
    })
    .catch(res.handle_error);
};

exports.get_places = function(req, res) {
    util.inherit(req.query, req.params);
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
    
    var count = 0, places;

    Place.count({})
    .then((c) => {
        count = c;

        if(!_.isUndefined(req.params.random))
            s = Math.floor(Math.random() * count);
        let field_res = ['place_name', 'rating', 'tag', 'thumbnail', 'address'];
        if(!_.isUndefined(req.params.field))
        {
            try
            {
                field_res = JSON.parse(req.params.field);
            }catch(err){}
        }

        return Place.find({})
        .limit(l)
        .skip(s)
        .select(field_res)
        .sort({place_name: 'asc'})
        .populate('subcategory')
        .populate('province');
    })
    .then((_places) => {
        places = _places.map((place) => {place.c_reviews = 2; return place;});
        res.json({status: 200, count, places});
    })
    .catch(res.handle_error);
};

exports.get_places_with_category = function(req, res) {
    util.inherit(req.query, req.params);
    /**
     * p: page
     * l: number record / page
     * category_id
     */
    if(_.isUndefined(req.params.province_id))
        req.params.province_id = 'all';
    if(_.isUndefined(req.params.sub_category_id))
        req.params.sub_category_id = 'all';

    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l)) l = 10;
    if(_.isNaN(s)) s = 0;

    var filter = {$or: []};
    var places;
    if(!_.isEqual(req.params.province_id, 'all'))
        filter.province = req.params.province_id;
    if(!_.isEqual(req.params.sub_category_id, 'all'))
        filter.subcategory = req.params.sub_category_id;

    SubCategory.find({category: req.params.category_id})
    .then((subcats) => {
        if(subcats.length == 0)
            return new Error('Category empty');

        subcats.forEach((sub) => {
            filter.$or.push({subcategory: sub._id});
        });

        return Place.count(filter)
        .then((c) => {
            if(!_.isUndefined(req.params.random))
                s = Math.floor(Math.random() * c);

            let field_res = ['place_name', 'rating', 'tag', 'thumbnail', 'address'];
            if(!_.isUndefined(req.params.field))
            {
                try
                {
                    field_res = JSON.parse(req.params.field);
                }catch(err){}
            }

            return Place.find(filter)
            .limit(l)
            .skip(s)
            .select(field_res)
            .sort({place_name: 'asc'})
            .populate('subcategory')
            .populate('province');
        });
    })
    .then((_places) => {
        places = _places.map((place) => {place.c_reviews = 2; return place;});

        res.json({status: 200, places});
    })
    .catch(res.handle_error);
};

exports.get_place_by_id = function(req, res) {
    if(!_.isString(req.params.place_id))
        return res.handle_error(new Error('missing parameter'));
    if(!req.isValidObjectId(req.params.place_id))
        return res.handle_error(new Error('invalid place id'));

    let place, photos, relative, reviews;
    Place.findOne({_id: req.params.place_id})
    .populate('subcategory')
    .populate('province')
    .then((_place) => {
        place = _place;

        return Photo.find({place: req.params.place_id});
    })
    .then((_photos) => {
        photos = _photos;

        if(typeof place.tag !== 'undefined' && place.tag.trim() !== '')
        {
            let tag = new RegExp('(' + place.tag.split(',').map((v) => v.trim()).join(')|(') + ')', 'gi');
            return Place.find({
                tag,
                _id: {$ne: place._id}
            })
            .limit(6);
        }
        else
           return Place.find({
               province: place.province,
               _id: {$ne: place._id}
            })
           .limit(6);
    })
    .then((_relative) => {
        relative = _relative;

        return Review.find({place: req.params.place_id})
        //    .populate('place')
            .populate('account', ['username']);
    })
    .then((_reviews) => {
        reviews = _reviews;

        return new Promise((r, rj) => {
            // geocode API
            const geocodeParams = {
                "address":    place.address,
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
        if(_.isNull(photos)) photos = [];
        if(_.isNull(reviews)) reviews = [];
        if(_.isNull(relative)) relative = [];

        res.json({status: 200, place, reviews, photos, relative, geo});
    })
    .catch(res.handle_error);
};

exports.filter = function(req, res) {
    //copy url query to params
    util.inherit(req.query, req.params);
    //add param
    if(_.isUndefined(req.params.province_id))
         req.params.province_id = 'all';
    if(_.isUndefined(req.params.sub_category_id))
         req.params.sub_category_id = 'all';
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

    if(!_.isEqual(req.params.province_id, 'all'))
        params.province = req.params.province_id;
    
    if(!_.isEqual(req.params.sub_category_id, 'all'))
        params.subcategory = req.params.sub_category_id;
    
    if(util.hasattr(req.params, 'address'))
        params.address = new RegExp(util.cvv2regexp(req.params.address), 'i');
    if(util.hasattr(req.params, 'name'))
        params.place_name = new RegExp(util.cvv2regexp(req.params.name), 'i');
    if(util.hasattr(req.params, 'rating'))
        params.rating = _.toNumber(req.params.rating);

    if((!_.isUndefined(params.province) && !req.isValidObjectId(params.province))
      || (!_.isUndefined(params.subcategory) && !req.isValidObjectId(params.subcategory)))
       return res.handle_error(new Error('invalid ObjectId'));

    Place.count(params)
    .then((c) => {
        count = c;

        if(!_.isUndefined(req.params.random))
            s = Math.floor(Math.random() * count);
        
        let field_res = ['place_name', 'rating', 'tag', 'thumbnail', 'address'];
        if(!_.isUndefined(req.params.field))
        {
            try
            {
                field_res = JSON.parse(req.params.field);
            }catch(err){}
        }

        return Place.find(params)
        .limit(l)
        .skip(s)
        .select(field_res)
        .sort({place_name: 'asc'})
        .populate('subcategory')
        .populate('province');
    })
    .then((places) => {
        //save a query with name
        if(util.hasattr(req.params, 'name'))
             insert_query(req.params.name, places);

        places = places.map((place) => {place.c_reviews = 2; return place;});
        res.json({status: 200, count, places});
    })
    .catch(res.handle_error);
};

exports.add_place = function(req, res) {
    if(!util.hasattr(req.body, ['place_name', 'address', 'detail', 'province_id', 'sub_category_id']))
         return res.handle_error(new Error('missing parameter'));
    if(!util.hasattr(req.body, ['place_name', 'address', 'detail', 'province_id', 'sub_category_id']))
         return res.handle_error(new Error('place_name, address, detail, province or category not empty'));

    //check
    var params = {
        place_name: req.body.place_name,
        address: req.body.address,
        detail: req.body.detail,
        thumbnail: 'place_no_image.jsg',
        rating: 0,
        phone: '',
        tag: ''
    };

    if(_.isString(req.body.thumbnail))
        params.thumbnail = req.body.thumbnail;
    if(_.isString(req.body.phone))
        params.phone = req.body.phone;
    if(_.isString(req.body.rating))
        params.rating = req.body.rating;
    if(_.isString(req.body.tag))
        params.tag = req.body.tag;

    SubCategory.findOne({_id: req.body.sub_category_id})
    .then((sub_category) => {
        if(_.isNull(sub_category))
           throw new Error('Category not found');

        params.subcategory = sub_category._id;
        return Province.findOne({_id: req.body.province_id});
    })
    .then((province) => {
        if(_.isNull(province))
            throw new Error('Province not found');
        
        params.province = province._id;
        return Place.create(params);
    })
    .then((data) => {
        res.json({status: 200, inserted: data});
    })
    .catch(res.handle_error);
};

exports.remove = function(req, res) {
    if(!req.isValidObjectId(req.body.place_id))
        return res.handle_error(new Error('invalid place id'));
    
    Place.remove({_id: req.body.place_id})
    .then(() => {
        return Review.remove({place: req.body.place_id});
    })
    .then(res.done_task)
    .catch(res.handle_error);
};

exports.update = function(req, res) {
    if (!util.hasattr(req.body, ['place_id']))
        return res.handle_error(new Error('missing parameter place_id'));

    Place.findById(req.body.place_id, function(err, params) {
        if (err)
            return res.handle_error(err);

        if (_.isString(req.body.thumbnail))
            params.thumbnail = req.body.thumbnail;
        if (_.isString(req.body.phone))
            params.phone = req.body.phone;
        if (_.isString(req.body.tag))
            params.tag = req.body.tag;
        if (_.isString(req.body.place_name))
            params.place_name = req.body.place_name;
        if (_.isString(req.body.address))
            params.address = req.body.address;
        if (_.isString(req.body.detail))
            params.detail = req.body.detail;
        if (_.isString(req.body.province_id))
            params.province = req.body.province_id;
        if (_.isString(req.body.sub_category_id))
            params.subcategory = req.body.sub_category_id;

        params.save(function(err2, doc) {
            if (err2) return res.handle_error(err2);
            res.json({
                status: 200,
                updated: doc
            });
        });
    });
};
