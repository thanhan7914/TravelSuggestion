const _ = require('lodash');
const Category = require('../../../model/category');
const SubCategory = require('../../../model/subcategory');

exports.get_list = function(req, res) {
    Category.find({}, function(err, cats) {
        if (err)
           res.json(error);
        res.json(cats);
    });
};

exports.get_sub_list = function(req, res) {
    if(!_.isString(req.params.category_id) || !req.isValidObjectId(req.params.category_id))
        return res.json({error: 'missing params or objectId invalid'});

    //category_id
    SubCategory.find({category: req.params.category_id})
    .then((cats) => {
        res.json(cats);
    })
    .catch((error) => {
        res.json(error);
    })
};

exports.add_category = function(req, res) {
    if(!_.isString(req.body.category_name))
      return res.json({error: 'not found name'});
    //{name}
    Category.create({category_name: req.body.category_name})
    .then((doc) => {
        res.json({status: 200, _id: doc._id, category_name: doc.name});
    })
    .catch((error) => {
        res.json({error});
    });
};

exports.add_sub_category = function(req, res) {
    if(!_.isString(req.body.sub_category_name) || !_.isString(req.body.category_id)
       || !req.isValidObjectId(req.body.category_id))
        return res.json({error: 'missing params or ObjectId invalid'});
    
    Category.findOne({_id: req.body.category_id})
    .then((cat) => {
        if(_.isEmpty(cat) || _.isNull(cat))
            throw new Error('Not found category');
        //add new sub category
        var sub_category = new SubCategory({
            category: cat._id,
            sub_category_name: req.body.sub_category_name
        });

        sub_category.save((error, sub_cat) => {
            if(error)
               return res.json(error);

            res.json({status: 200, sub_category_id: sub_cat._id});
        });
    })
    .catch((error) => {
        res.json({error: error.message});
    });
};