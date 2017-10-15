const _ = require('lodash');
const Query = require('../../../model/query');
const FindResult = require('../../../model/findresult');

module.exports = function(keyword, places) {
    Query.findOne({keyword})
    .then((q) => {
        if(!_.isNull(q))
        {
            q.n_fetch++;
            return q.save();
        }

        return Query.create({keyword})
        .then((query) => {
            if(places.length == 0) return 0;

            var results = [];
            places.forEach((place) => {
                results.push({
                    query: query._id,
                    place: place._id
                });
            });

            FindResult.create(results)
            .then((inserted) => {
                //done
            });
        });
    });
};