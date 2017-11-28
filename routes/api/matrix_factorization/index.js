const _ = require('lodash');
const Place = require('../../../model/place');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');
const Review = require('../../../model/review');
const Account = require('../../../model/account');
const util = require('../../../util');

let ObjectIdEquals = function(id1, id2)
{
    return String(id1) == String(id2);
}

let append_idx = function(Lin)
{
    let len = Lin.length;

    for(let i = 0; i < len; i++)
       Lin[i].idx = i;
};

let get_position = function(id, Lin)
{
    for(let L of Lin)
        if(ObjectIdEquals(L._id, id))
            return L.idx;
    
    return -1;
}

let combine = function(accounts, places, reviews)
{
    append_idx(accounts);
    append_idx(places);
    //sort
    accounts.sort((a, b) => a.idx > b.idx);
    places.sort((a, b) => a.idx > b.idx);
    let m = accounts.length;
    let n = places.length;

    let Xboard = new Array(m);
    for(let i = 0; i < m; i++)
        Xboard[i] = new Array(n);

    for(let i = 0; i < m; i++)
        for(let j = 0; j < n; j++)
           Xboard[i][j] = -1;
    
    for(let rv of reviews)
    {
        let i = get_position(rv._id.account, accounts);
        let j = get_position(rv._id.place, places);

        if(i === -1 || j === -1) continue;
       
        Xboard[i][j] = rv.rating;
    }

    return Xboard;
};

let build_matrix = function() 
{
    let accounts, places, reviews;

    return Account.find({})
    .select('username')
    .then((data) => {
        accounts = data;

        return Place.find({})
        .select('place_name');
    })
    .then((data) => {
        places = data;

        return Review//.find({});
        .aggregate(
            [
                {
                    $group: {
                        _id: {
                            "place": "$place",
                            "account": "$account"
                        },
                        rating: {$avg: "$rating"}
                    }
                }
            ]
        );
    })
    .then((data) => {
        reviews = data;

        return combine(accounts, places, reviews);
      //  return {accounts, places, reviews};
    })
    .then((Xboard) => {
        return {accounts, places, reviews, Xboard};
    });
};

exports.render = function(req, res)
{
    build_matrix()
    .then(res.array_dump);
};
