  function initMap() {
        var options = null;

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

          if(browserChrome){
            options={enableHighAccuracy: false, maximumAge: 15000, timeout: 30000};
          }
          else{
            options={maximumAge:Infinity, timeout:0};
          }

          navigator.geolocation.getCurrentPosition(function(position){
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
          }, options);
        }
        else{
          // Browser doesn't support Geolocation
          console.log('nav NOT availaible');
          handleLocationError(false, infoWindow, map.getCenter());
        }

  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
  }
