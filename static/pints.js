
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

    var latitude  = 48.2083537;
    var longitude = 16.3725042;

    if(navigator.geolocation){
        console.log('nav availaible');

        navigator.geolocation.getCurrentPosition(function(position){
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

          window.setTimeout(function(){
            $.getJSON('/data/pubs3.json?='+Date.now(), function(data){
                var pubs = new Array();
                $.each(data, function(index, pub){
                  console.log("each");
                  var distance = calc_distance(pos.lng, pos.lat, pub.location.longitude, pub.location.latitude);
                  pubs.push([distance, pub]);
                });

                function compare_distance(a, b){
                  if (a[0] < b[0]) return -1;
                  if (a[0] > b[0]) return 1;
                  return 0;
                };
                pubs.sort(compare_distance);

                $('#pub-list2').find('ul').html('');            

                for(i = 0; i < pubs.length; ++i){
                  obj = pubs[i];
                  var lst = "<li>";
                  lst += obj[1].name;
                  /* for(i = 0; i < obj[1].categories.length; ++i){
                    lst += obj[1].categories[i].category;
                  }; */
                  lst += obj[1].food;
                  lst += obj[1].location.address;
                  lst += obj[1].location.longitude;
                  lst += obj[1].location.latitude;
                  lst += obj[1].opening;
                  lst += obj[1].website;
                  /* for(i = 0; i < obj[1].mails.length; ++i){
                    lst += obj[1].mails[i].mail;
                  };
                  for(i = 0; i < obj[1].phones.length; ++i){
                    lst += obj[1].phones[i].phone;
                  }; */
                  lst += obj[1].feature;
                  /* lst += obj[1].event; */
                  lst += "</li>";
                  $('#pub-list2').find('ul').append(lst);
                };
            });
          },1);
        }, function(){
            console.log('error in function');
          }, options);
        }
        else{
          // Browser doesn't support Geolocation
          console.log('nav NOT availaible');
        }
    }
