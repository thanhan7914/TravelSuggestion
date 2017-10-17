const _ = require('lodash');
const Query = require('../../../model/query');
const FindResult = require('../../../model/findresult');
const Place = require('../../../model/place');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');
const Review = require('../../../model/review');
const insert_query = require('./query');
const util = require('../../../util');

module.exports = function(req, res) {
    //lookup error
    //https://github.com/Automattic/mongoose/issues/3682
    //change to

    FindResult.aggregate([
        {
            $group: {
                _id: '$place',
                query: {$sum: 1}
            }
        // },
        // {
        //     $lookup:
        //     {
        //       from: 'places',
        //       localField: '_id',
        //       foreignField: '_id',
        //       as: 'place'
        //     }
        }
    ])
    .sort({'query': 'desc'})
    .limit(10)
    .then((rows) => {
        if(rows.length === 0)
             return new Error('No entries');

        var filter = {$or: []};
        rows.forEach((row) => {
            filter.$or.push({_id: row._id});
        });

        return Place.find(filter)
        .sort({'rating': 'desc'});
    })
    .then((places) => {
        res.json({status: 200, places});
    })
    .catch(res.handle_error);
};