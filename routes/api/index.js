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
const thumbnail = require('./controller/thumbnail');

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
router.get('/place/:place_id', place.get_place_by_id);
router.get('/places/filter/:province_id/:sub_category_id/:p/:l', place.filter);

/** Add a place - parameter
 * sub_category_id: ObjectId
 * province_id: ObjectId
 * thumbnail_id: ObectId
 * place_name: String
 * phone: String [*]
 * address: String
 * tag: String [*]
 * detail: String
 */

router.post('/place/add', place.add_place);

//news
router.get('/news/:p/:l', news.get_news);
router.get('/news/:id', news.get_news_by_id);

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

//thumbnail
router.get('/thumbnail/:thumbnail_id', thumbnail.get_thumbnail);

/** add thumbnail - parameter
 * file_name
 * rel_path
 */

router.post('/thumbnail/add', thumbnail.add_thumbnail);

/** update thumbnail - parameter
 * thumbnail_id
 * file_name
 * rel_path
 */

router.post('/thumbnail/update', thumbnail.update_thumbnail);

module.exports = router;
