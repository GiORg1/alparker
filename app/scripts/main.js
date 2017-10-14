
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
      position: google.maps.ControlPosition.TOP_LEFT
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER
    },



  });
  //Car Part done by Adam
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
  var car_number = 1;
  //this is our box we get data from - cars will be rendered inside and will also drive inside
  var limiting_coordinates = [new google.maps.LatLng(41.391603, 2.145333), new google.maps.LatLng(41.387482, 2.157242)]
  for(var i = 0; i<car_number; i++){
      var rPoint = randomPoint(limiting_coordinates[0], limiting_coordinates[1]);
      directionsService.route({
      origin:rPoint,
      destination: randomPoint(limiting_coordinates[0], limiting_coordinates[1]),
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
    if(car.pointOnPath<car.path.length){
      if(car.midpoint){
        if(car.pointOnPath<(car.path.length-1)){
          moveCar(car, new google.maps.LatLng(
            (car.path[car.pointOnPath].lat() + car.path[(car.pointOnPath+1)].lat())/2,
            (car.path[car.pointOnPath].lng() + car.path[(car.pointOnPath+1)].lng())/2
          ));
        }
        car.midpoint = false;
        car.pointOnPath++;
      }else{
        car.midpoint = true;
        moveCar(car, car.path[car.pointOnPath]);
      }

    }else{
      car.midpoint = false;

      car.target = randomPoint(limiting_coordinates[0], limiting_coordinates[1]);
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
    }, 1500);
  }, 2000);
  //Car Part done by Adam

  function CenterControl(controlDiv, map) {
    // Set CSS for the button border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '16px';
    controlUI.style.textAlign = 'center';
    controlUI.style.marginTop = '10px';
    controlUI.title = 'Click to set the destination';
    controlDiv.appendChild(controlUI);

    // Set CSS for the button interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Comfortaa';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '28px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'SUBMIT';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function () {
      console.log("Hello world!");
      console.log(markers);
      window.alert(markers[markers.length - 1].position);
    });
  };

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //comment this out to move the search box anywhere
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  var markers = [];
  searchBox.addListener('places_changed', function() {

    clearLocations();
    var places = searchBox.getPlaces();


    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.

    clearLocations();

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
    clearLocations();

    placeMarker(event.latLng);

  });

  function placeMarker(location) {
    markers.push( new google.maps.Marker({
      position: location,
      map: map,
    }));
  }

  function clearLocations() { //Clears out all marker data from array 'markers'
    info_Window = new google.maps.InfoWindow();
    info_Window.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }

}





