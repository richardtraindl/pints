  function initMap() {

        var latitude  = 48.2083537;
        var longitude = 16.3725042;

        var map = new google.maps.Map(document.getElementById('map-vienna'), {
          center: {lat: latitude, lng: longitude},
          zoom: 16
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if(navigator.geolocation){
          console.log('nav availaible');
          var location_timeout = setTimeout("handleLocationError", 10000);
          
          navigator.geolocation.getCurrentPosition(function(position){
            clearTimeout(location_timeout);
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            console.log('error in function');
            handleLocationError(true, infoWindow, map.getCenter());
          });
        }
        else{
          console.log('nav NOT availaible');
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
