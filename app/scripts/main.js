var map;
var markers = [];

function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.3851, lng: 2.1734},
    zoom: 14,
    mapTypeId:'roadmap',
    styles: [
      {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]

  });
}

var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});
