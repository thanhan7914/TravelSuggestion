const GoogleMapsAPI = require('googlemaps');
const publicConfig = {
    key: 'AIzaSyD2tKEYkzH_23dAcPnXnbkBzcc_U26Gxxw',
    stagger_time:       1000,
    encode_polylines:   false,
    secure:             true
  };

const  gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = function(latlng)
{
    if(latlng.startsWith('"')) latlng = latlng.substring(1);
    if(latlng.endsWith('"')) latlng = latlng.substring(0, latlng.length - 1);
    var reverseGeocodeParams = {
        "latlng": latlng,
    //    "result_type": "postal_code",
        "language": "vn",
        "location_type": "APPROXIMATE"
      };
       
    return new Promise((r, rj) => {
        gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
            if(err) return rj(err);

            if(result.status !== 'OK')
                return rj(new Error("not found"));
                
            r(result.results);
        });
    });
};
