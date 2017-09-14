function initMap() {
        
        console.log( "call initMap()" );
        var latitude  = 48.2083537;
        var longitude = 16.3725042;
        
        var map = new google.maps.Map(document.getElementById('map-vienna'), {
          center: {lat: latitude, lng: longitude},
          zoom: 16
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        
        console.log( "before navigator gelocation" );


// Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

  }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }

function geoFindMe() {
  var output = document.getElementById("map-vienna");

  /* if(!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  } */

  function success(position){
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAHDmag3kq2zgu8LWZDReFKSTZjGDe1btM?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
  }

  function error() {
    output.innerHTML = '<p>Unable to retrieve your location<br>' + 
                       'Set location to Centre Vienna</p>';

    var latitude  = 48.2083537;
    var longitude = 16.3725042;
    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyAHDmag3kq2zgu8LWZDReFKSTZjGDe1btM?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
