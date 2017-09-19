
var calc_distance = function(long, lat, long1, lat1){
    erdRadius = 6371;

    long = long * (Math.PI/180);
    lat = lat * (Math.PI/180);
    long1 = long1 * (Math.PI/180);
    lat1 = lat1 * (Math.PI/180);
    
    x0 = long * erdRadius * Math.cos(lat);
    y0 = lat  * erdRadius;

    x1 = long1 * erdRadius * Math.cos(lat1);
    y1 = lat1  * erdRadius;

    dx = x0 - x1;
    dy = y0 - y1;

    d = Math.sqrt((dx*dx) + (dy*dy));

    if(d < 1){
        return Math.round(d*1000) + " m";
    }
    else{
        return Math.round(d*10)/10 + " km";
    }
};

  function initMap() {
        var options = {
          enableHighAccuracy: true,
          timeout: 70000,
          maximumAge: 0
        };

        var latitude  = 48.2083537;
        var longitude = 16.3725042;

        var map = new google.maps.Map(document.getElementById('map-vienna'), {
          center: {lat: latitude, lng: longitude},
          zoom: 13
        });

        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if(navigator.geolocation){
          console.log('nav availaible');

          navigator.geolocation.getCurrentPosition(function(position){
            console.log('xxxx');
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
            
            window.setTimeout(function(){
              $.getJSON('/data/pubs.json?='+Date.now(), function(data){
                $('#pub-list').find('ul').html('');

                $.each(data, function(pub, pubdata){
                  $('#pub-list').find('ul').append('<li class="' + 
                    pubdata.Kategorie + '"><img src="http://maps.google.com/maps/api/staticmap?center=' +
                    pubdata.Position.Latitude + ',' + pubdata.Position.Longitude + '&zoom=13&size=50x50&markers=color:blue|size:tiny|' + 
                    pubdata.Position.Latitude + ',' + pubdata.Position.Longitude + '&sensor=true"/>' + 
                    pub + '<span>' + 
                    calc_distance(pos.lng, pos.lat, pubdata.Position.Longitude, pubdata.Position.Latitude) + 
                    '</span></li>');

                  marker = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(pubdata.Position.Latitude, pubdata.Position.Longitude)
                  });
                });
                // window.scrollTo(0,1);
              });
            },1);
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


function rank_pubs(){
    var options = {
          enableHighAccuracy: true,
          timeout: 70000,
          maximumAge: 0
        };

    if(navigator.geolocation){
      console.log('nav availaible');

      window.setTimeout(function(){
        navigator.geolocation.getCurrentPosition(
          function(position){ 
            return [-1, position.coords.latitude, position.coords.longitude]; 
          }, 
          function(){ 
            console.log('error in function'); 
            return [1, null, null]; 
          }, 
          options);
        }, 8);
    }
    else{
      console.log('nav NOT availaible');
      return [0, null, null];
    }
  }

function show_pubs(){
    var geo = rank_pubs();
    console.log(geo[0] + geo[1] + geo[2]);
    alert(geo[0]);
}
