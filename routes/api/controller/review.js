const _ = require('lodash');
const Account = require('../../../model/account'); 
const Place = require('../../../model/place');
const Review = require('../../../model/review');

/**
 * 
 * @param {*} place_id 
 * @return an object contain rating point and reviews from client
 */

function calc_rating(place_id) {
    var point = 0;
    var n_elements = 0;

    return Review.find({place: place_id})
    .then((reviews) => {
        n_elements = reviews.length;
        if(n_elements == 0)
           return 0;
        
        reviews.forEach((review) => {
            point += _.toNumber(review.rating);
        });

        return (point / n_elements);
    });
}

exports.get_review = function(req, res) {
    if(!req.isValidObjectId(req.params.place_id))
        return res.json({error: 'objectId invalid'});

    Review.find({place: req.params.place_id})
//    .populate('place')
    .populate('account', ['username'])
    .then((reviews) => {
        res.json({status: 200, reviews});
    })
    .catch(res.handle_error);
};

exports.add_review = function(req, res) {
    if(!_.isString(req.body.place_id) || !_.isString(req.body.username)
       || _.isNull(req.body.rating) || !_.isString(req.body.comment))
        return res.json({error: 'missing params'});
    
    if(!req.isValidObjectId(req.body.place_id))
        return res.json({error: 'objectId invalid'});

    var params = {};
    params.rating = _.toNumber(req.body.rating);
    if(_.isNaN(params.rating) || !_.isNumber(params.rating))
        return res.json({error: 'missing params rating'});
    
    Place.findOne({_id: req.body.place_id})
    .then((place) => {
        if(_.isNull(place) || _.isEmpty(place))
           throw new Error('place not found');

        params.place = place;
        return Account.findOne({username: req.body.username});
    })
    .then((account) => {
        if(_.isNull(account) || _.isEmpty(account))
           throw new Error('account not found');
        
        var review = new Review({
            place: params.place._id,
            account: account._id,
            rating: params.rating,
            comment: req.body.comment,
            create_date: Date.now()
        });

        return review.save();
    })
    .then((review) => {
        return calc_rating(req.body.place_id);
    })
    .then((rating) => {
        return Place.findOneAndUpdate({_id: req.body.place_id}, {rating});
    })
    .then((place) => {
        res.json({status: 200, message: 'comment added.'});
    })
    .catch(res.handle_error);
};

exports.remove = function(req, res) {
    if(!_.isValidObjectId(req.body.review_id))
        return res.handle_error(new Error('invalid ObjectId'));
    
    Review.remove({_id: req.body.review_id})
    .then(res.done_task)
    .catch(res.handle_error);
};