const _ = require('lodash');
const Place = require('../../../model/place');
const Province = require('../../../model/province');
const SubCategory = require('../../../model/subcategory');
const Review = require('../../../model/review');
const Account = require('../../../model/account');
const util = require('../../../util');
const matrix = require('./matrix');
const mf = require('./mf');

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
};

let get_place_id = function(idx, places)
{
    for(let L of places)
        if(L.idx === idx)
            return L._id;
    
    return "";
};

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

        let Xboard = combine(accounts, places, reviews);
        return {accounts, places, Xboard};
      //  return {accounts, places, reviews};
    });
};

let build_matrix_predection = function() 
{
    return build_matrix()
    .then((data) => {
        let {m, n} = matrix.size(data.Xboard);
        let min = m < n ? m : n;
        let K =  Math.floor(Math.random() * (min - 1)) + 1;
        let beta = 0.2;//Math.abs(Math.random());
        let lambda = 0.6;
        //loop
        let loop = 10000;

        let {W, H} = mf.mf_train(data.Xboard, loop, K, beta, lambda);
        let Xbuild = mf.mf_rebuild(data.Xboard, W, H);

        let _collumns = matrix.sum_collumns(Xbuild);
        _collumns = _collumns.map((v, idx) => {return {rating: v/n, idx, place: get_place_id(idx, data.places)}; });
        _collumns.sort((a, b) => a.rating < b.rating);
        let limit = 10;
        limit = limit > n ? n: limit;

        return {status: 200, suggestion: _collumns.slice(0, limit)};
    });
};

exports.render = function(req, res)
{
    build_matrix_predection()
    .then(res.array_dump);
};
