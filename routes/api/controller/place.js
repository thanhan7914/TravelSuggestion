exports.get_places = function(req, res) {
    console.log(req.params);
    res.json({status: 200});
};

exports.get_place_by_id = function(req, res) {
    console.log(req.params);
    res.json({status: 200});
};