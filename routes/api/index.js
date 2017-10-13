const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../../util');
//controller
const place = require('./controller/place');
const news = require('./controller/news');
const review = require('./controller/review');
const category = require('./controller/category');

router.post(/[a-z0-9_\.\/]/i, function(req, res, next) {
    //check token
    //call next
    if(_.isString(req.body.token) && _.isEqual(req.body.token, util.token))
      return next();
    //error
    res.json({error: 'error token not match'});
});

router.get('/', function(req , res) {
    res.end('Travel Suggestion API v1.0.0');
});

//place
router.get('/places/:s/:n', place.get_places);
router.get('/place/:id', place.get_place_by_id);

//news
router.get('/news/:s/:n', news.get_news);
router.get('/news/:id', news.get_news_by_id);

//review
router.get('/review/:place_id', review.get_review);
router.post('/review/add', review.add_review);

//category and sub category
router.get('/category/list', category.get_list);
router.get('/category/sub-list/:category_id', category.get_sub_list);
router.post('/category/add', category.add_category);
router.post('/category/sub_add', category.add_sub_category);

module.exports = router;
