
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
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
    ],
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER
    },



  });

  //code for creation and movement of cars

  var cars = []; 
 
  var directionsService = new google.maps.DirectionsService(); 

  //Places a car at position 
  function placeCar(position){ 
    var car = new google.maps.Marker({ 
      position: position, 
      icon: './images/caricon.png', 
      clickable: false, 
      map: map 
    }); 
    car.path = []; 
    car.startPosition = car.position; 
    car.waypoints = []; 
    car.totalDistance = 0; 
    car.pointOnPath = 0; 

    car.target = new google.maps.LatLng(41.390673, 2.165964); 
    directionsService.route({ 
        origin:car.getPosition(), 
        destination:new google.maps.LatLng(41.390673, 2.165964), 
        travelMode: google.maps.TravelMode.DRIVING 
      }, function(result, status) { 
        if (status == google.maps.DirectionsStatus.OK) { 
          car.path = result.routes[0].overview_path; 
          car.pointOnPath = 0; 
        } 
      } 
    ); 

    cars.push(car); 

  } 

  //Returns a random point within the area defined bottomLeft and topRight 
  function randomPoint(bottomLeft, topRight){ 
    var latDiff = topRight.lat() - bottomLeft.lat(); 
    var lngDiff = topRight.lng() - bottomLeft.lng(); 
    var newLat = bottomLeft.lat() + Math.random() * latDiff; 
    var newLng = bottomLeft.lng() + Math.random() * lngDiff; 
    return new google.maps.LatLng(newLat, newLng); 
  } 

  //Place cars at random position in latlng range and drive them to location 
  var car_number = 2; 
  for(var i = 0; i<car_number; i++){ 
      var rPoint = randomPoint(new google.maps.LatLng(41.390593, 2.169290), new google.maps.LatLng(41.389997, 2.161394)); 
      directionsService.route({ 
      origin:rPoint, 
      destination:new google.maps.LatLng(41.390673, 2.165964), 
      travelMode: google.maps.TravelMode.DRIVING 
    }, function(result, status) { 
      if (status == google.maps.DirectionsStatus.OK) { 
        placeCar(new google.maps.LatLng(result.routes[0].legs[0].start_location.lat(), result.routes[0].legs[0].start_location.lng())); 
      }else{ 
        alert("Error: Google Maps API not returning location data. The app will restart."); 
        window.location = "./"; 
      } 
    }); 
  } 

  //Relocates car to position 
  function moveCar(car, position){ 
    car.setPosition(position); 
  } 

  //Moves a car along its path at the correct speed 
  function advance(car){ 
    car.pointOnPath++; 
    if(car.pointOnPath<car.path.length){ 
      moveCar(car, car.path[car.pointOnPath]); 
    }else{
      car.pointOnPath = 0; 

      car.target = randomPoint(new google.maps.LatLng(41.390593, 2.169290), new google.maps.LatLng(41.389997, 2.161394));
      directionsService.route({ 
          origin:car.getPosition(), 
          destination:car.target, 
          travelMode: google.maps.TravelMode.DRIVING 
        }, function(result, status) { 
          if (status == google.maps.DirectionsStatus.OK) { 
            car.path = result.routes[0].overview_path; 
            car.pointOnPath = 0; 
          } 
        } 
      ); 
    }         
  } 

  setTimeout(function() { 
    timer = setInterval(function(){ 
      for(var f = 0; f<car_number;f++){ 
        advance(cars[f]); 
      } 
    }, 1000); 
  }, 2000);   
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //comment this out to move the search box anywhere

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  var markers = [];
  searchBox.addListener('places_changed', function() {

    markers[0].setMap(null);
    markers = [];
    var places = searchBox.getPlaces();


    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.

    markers.forEach(function(marke0r) {
      marker.setMap(null);
    });

    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location

      }));

      window.alert(markers[0].position);


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  map.addListener('click', function(event) {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });

    placeMarker(event.latLng);

  });

  function placeMarker(location) {
    markers.push( new google.maps.Marker({
      position: location,
      map: map,
    }));
  }

}





