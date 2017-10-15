const express = require('express');
const router = express.Router();
const _ = require('lodash');
const util = require('../../util');

//controller
const place = require('./controller/place');
const news = require('./controller/news');
const review = require('./controller/review');
const category = require('./controller/category');
const province = require('./controller/province');
const photo = require('./controller/photo');
const account = require('./controller/account');

//suggestion
const suggestion = require('./controller/suggestion');

/**
 * check token match
 */
router.post(/[a-z0-9_\.\/]/i, function(req, res, next) {
    //check token
    //call next
    if(_.isString(req.body.token) && _.isEqual(req.body.token, util.token))
      return next();
    //token mismatch
    res.json({error: 'error token mismatch'});
});

router.get('/', function(req , res) {
    res.end('Travel Suggestion API v1.0.0');
});

//place
router.get('/places/:p/:l', place.get_places);
//url get query
router.get('/places/list', place.get_places);
router.get('/place/:place_id', place.get_place_by_id);
router.get('/places/filter/:province_id/:sub_category_id/:p/:l', place.filter);
//using get query ?province_id=&sub_category_id&p=&l=&name&address=&rating=
router.get('/places/filter', place.filter);

/**
 * Remove a place - parameter
 * place_id: ObjectId
 */

router.post('/place/remove', place.remove);

/** Add a place - parameter (add, update)
 * sub_category_id: ObjectId
 * province_id: ObjectId
 * thumbnail: String [*]
 * place_name: String
 * phone: String [*]
 * address: String
 * tag: String [*]
 * detail: String
 */

router.post('/place/add', place.add_place);
router.post('/place/update', place.update);

//news
router.get('/news/:p/:l', news.get_news);
router.get('/news/list', news.get_news);
router.get('/news/filter/:province_id/:category_id/:p/:l', news.filter);
router.get('/news/filter', news.filter);
router.get('/news/:news_id', news.get_news_by_id);

/**
 * Remove a news - parameter
 * place_id: ObjectId
 */

router.post('/news/remove', news.remove);

/** Add a News - parameter
 * category_id: ObjectId
 * province_id: ObjectId
 * title: String
 * content: String
 * tag: String [*]
 * thumbnail: String [*]
 * date: Date.now() [*]
 */

router.post('/news/add', news.add_news);
router.post('/news/update', news.update);

//review
router.get('/review/:place_id', review.get_review);

/** parameter
 * place_id: ObjectId
 * username: String
 * rating: Number
 * comment: String
 */

router.post('/review/add', review.add_review);

//category and sub category
router.get('/category/list', category.get_list);
router.get('/category/sub-list/:category_id', category.get_sub_list);

/** parameter
 * category_name: String
 */

router.post('/category/add', category.add_category);

/** parameter
 * category_id: ObjectId
 * sub_category_name: String
 */

router.post('/category/sub_add', category.add_sub_category);

//province
router.get('/province/list', province.get_list);

/** Add a province - parameter
 * province_name: String
 */

router.post('/province/add', province.add_province);

//photo
router.get('/photo/:place_id', photo.get_list);

/** parameter
 * place_id
 * file_name
 * rel_path
 */

router.post('/photo/add', photo.add_photo);

/** remove - parameter
 * photo_id
 */

router.post('/photo/remove', photo.remove_photo);

//account
router.get('/account/list', account.get_list);

/** Add a account - parameter
 * username: String
 * password: String
 */

router.post('/account/add', account.add_account);

//suggestion
router.get('/places/suggestion', suggestion);

module.exports = router;
