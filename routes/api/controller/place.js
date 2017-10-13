const _ = require('lodash');
const Place = require('../../../model/place');
const Thumbnail = require('../../../model/thumbnail');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');

exports.get_places = function(req, res) {
    /**
     * p: page
     * l: number record / page
     */

    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l) || _.isNaN(s))
       return res.handle_error(new Error('invalid parameter'));

    Place.find({})
    .limit(l)
    .skip(s)
    .sort({place_name: 'asc'})
    .populate('subcategory')
    .populate('thumbnail')
    .populate('province')
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.get_place_by_id = function(req, res) {
    if(!_.isString(req.params.place_id))
        return res.handle_error(new Error('missing parameter'));
    if(!req.isValidObjectId(req.params.place_id))
        return res.handle_error(new Error('invalid place id'));

    Place.findOne({_id: req.params.place_id})
    .populate('subcategory')
    .populate('thumbnail')
    .populate('province')
    .then((place) => {
        res.json({status: 200, place});
    })
    .catch(res.handle_error);
};

exports.filter = function(req, res) {
    /**
     * p: page
     * l: number record / page
     */

    var l = _.toNumber(req.params.l);
    var s = _.toNumber(req.params.p);
    s = Math.max(0, s);
    s *= l;

    if(_.isNaN(l) || _.isNaN(s))
        return res.handle_error(new Error('invalid parameter'));

    var params = {};

    if(!_.isEqual(req.params.province_id, 'all'))
        params.province = req.params.province_id;
    
    if(!_.isEqual(req.params.sub_category_id, 'all'))
        params.subcategory = req.params.sub_category_id;
    
    if((!_.isUndefined(params.province) && !req.isValidObjectId(params.province))
      || (!_.isUndefined(params.subcategory) && !req.isValidObjectId(params.subcategory)))
       return res.handle_error(new Error('invalid ObjectId'));

    Place.find(params)
    .limit(l)
    .skip(s)
    .sort({place_name: 'asc'})
    .populate('subcategory')
    .populate('thumbnail')
    .populate('province')
    .then(res.array_dump)
    .catch(res.handle_error);
};

exports.add_place = function(req, res) {
    //check
    var params = {
        place_name: req.body.place_name,
        address: req.body.address,
        detail: req.body.detail
    };

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
        return Thumbnail.findOne({_id: req.body.thumbnail_id});
    })
    .then((thumb) => {
        if(_.isNull(thumb))
            throw new Error('Thumbnail not found');
        
        params.thumbnail = thumb._id;
        return (new Place(params)).save();
    })
    .then((data) => {
        res.json({status: 200, inserted: data});
    })
    .catch(res.handle_error);
};