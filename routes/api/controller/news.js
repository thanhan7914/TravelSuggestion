const _ = require('lodash');
const News = require('../../../model/news');
const Province = require('../../../model/province');
const Category = require('../../../model/category');
const util = require('../../../util');

exports.get_news = function(req, res) {
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
    
    var count = 0;

    News.count({})
    .then((c) => {
        count = c;

        return News.find({})
        .limit(l)
        .skip(s)
        .sort({date: 'desc'})
        .populate('province')
        .populate('category');
    })
    .then((news) => {
        res.json({status: 200, count, news});
    })
    .catch(res.handle_error);
};

exports.filter = function(req, res) {
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
    
    var params = {};
    var count = 0;

    if(!_.isEqual(req.params.province_id, 'all'))
        params.province = req.params.province_id;
    
    if(!_.isEqual(req.params.category_id, 'all'))
        params.category = req.params.category_id;
    
    if(util.hasattr(req.params, 'title'))
        params.title = new RegExp(req.params.title, 'i');
    
    if((!_.isUndefined(params.province) && !req.isValidObjectId(params.province))
      || (!_.isUndefined(params.category) && !req.isValidObjectId(params.category)))
       return res.handle_error(new Error('invalid ObjectId'));

    News.count(params)
    .then((c) => {
        count = c;

        return News.find(params)
        .limit(l)
        .skip(s)
        .sort({date: 'desc'})
        .populate('province')
        .populate('category');
    })
    .then((news) => {
        res.json({status: 200, count, news});
    })
    .catch(res.handle_error);
};

exports.get_news_by_id = function(req, res) {
    if(!req.isValidObjectId(req.params.news_id))
        return res.handle_error(new Error('invalid ObjectId'));

    res.json({status: 200});
    News.find({_id: req.params.news_id})
    .populate('province')
    .populate('category')
    .then((news) => {
        res.json(news);
    })
    .catch(res.handle_error);
};

exports.add_news = function(req, res) {
    if(!util.hasattr(req.body, ['title', 'content', 'category_id', 'province_id']))
         return res.handle_error(new Error('missing parameter'));

    //check
    var params = {
        title: req.body.title,
        content: req.body.content,
        thumbnail: 'news_no_image.jsg',
        tag: '',
        date: Date.now()
    };

    if(_.isString(req.body.thumbnail))
        params.thumbnail = req.body.thumbnail;
    if(_.isString(req.body.tag))
        params.tag = req.body.tag;

    Category.findOne({_id: req.body.category_id})
    .then((category) => {
        if(_.isNull(category))
           throw new Error('Category not found');

        params.category = category._id;
        return Province.findOne({_id: req.body.province_id});
    })
    .then((province) => {
        if(_.isNull(province))
            throw new Error('Province not found');
        
        params.province = province._id;
        return News.create(params);
    })
    .then((data) => {
        res.json({status: 200, inserted: data});
    })
    .catch(res.handle_error);
};