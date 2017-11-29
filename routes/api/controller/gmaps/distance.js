const GoogleMapsAPI = require('googlemaps');
const publicConfig = {
    key: 'AIzaSyDHXdDCeYbGzHaZnlw6u1fSsrbRXFMzZx0',
    stagger_time:       1000,
    encode_polylines:   false,
    secure:             true
};

const  gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = function(origins, destinations)
{
    return new Promise((r, rj) => {
        gmAPI.distance({ origins, destinations}, function(err, results) {
            if(err) rj(err);
            r(results);
        });
    });
};
