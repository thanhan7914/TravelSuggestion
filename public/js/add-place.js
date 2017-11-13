function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 15.913888,
            lng: 107.730302
        },
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(14); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    });
}
// post data form to server throught 
$(document).ready(function () {

    //select province
    $.get('http://tlsg.tk/api/province/list', function (data, status) {
        var i = 0;
        $.each(data, function (key, value) {
            $('#province')
                .append($("<option></option>")
                    .attr("value", data[i]._id)
                    .text(data[i].province_name));
            i++;
        });

    });

    //select category
    $.get('http://tlsg.tk/api/category/sub-list/59e321f42a36f02f45b3fdcc', function (data, status) {
        data.forEach((i) => {
            $('#sub_category')
                .append($("<option></option>")
                    .attr("value", i._id)
                    .text(i.sub_category_name));
        });


    });
    
});