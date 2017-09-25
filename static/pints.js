
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

    //if(d < 1){
    //    return Math.round(d*1000) + " m";
    //}
    //else{
    return Math.round(d*10)/10; //  + " km";
    //}
};

   function show_pubs(location, count){
      // window.setTimeout(function(){
        // $.getJSON('/data/pubs3.json?='+Date.now(), function(data){
        $.getJSON('/data/pubs3.json', function(data){
            var rpubs = new Array();

            $.each(data, function(index, pub){
              var distance = calc_distance(location.longitude, location.latitude, pub.location.longitude, pub.location.latitude);
              rpubs.push([distance, pub]);
            });

            function compare_distance(a, b){
              if (a[0] < b[0]) return -1;
              if (a[0] > b[0]) return 1;
              return 0;
            };

            rpubs.sort(compare_distance);

            if(location.status == 1){
              $('#msg').html('');
              var msg = "<p>You have denied geolocation prompt. <br>Pints assumes the center of the city as your current location!</p>";
              $('#msg').find('p').append(msg);
            }

            $('#pub-list').html('');
            $('#pub-list').append("<ul></ul>");

            var cnt = 0;
            for(let rpub of rpubs){
              cnt += 1;
              if(cnt <= count){
                  var distance = rpub[0];
                  var pub = rpub[1];

                  var lst = "<li>";
                  lst += "<div class='div-table'>";
                  lst += "<div class='div-row' style='height: 40px; text-overflow: ellipsis;'";
                  lst += " id='" + pub.id + "'";
                  lst += " srclng='" + location.longitude + "'";
                  lst += " srclat='" + location.latitude + "'";
                  lst += " dstlng='" + pub.location.longitude + "'";
                  lst += " dstlat='" + pub.location.latitude + "'";
                  lst += " onclick='show_pub(" + pub.id + ")'>";
                  lst += "<div class='div-cell' style='width: 90%; vertical-align: middle;'>";
                  lst += pub.name + " ";
                  for (let category of pub.categories){
                    lst += category.category + " ";
                  };
                  lst += pub.food + " ";
                  lst += pub.features + " ";
                  lst += pub.openings + " ";
                  /* for(let phone of pub.phones){
                    lst += phone.phone + " ";
                  };
                  lst += "<br>";
                  for (let mail of pub.mails){
                    lst += mail.mail + " ";
                  }; */
                  lst += "</div>"; // cell

                  lst += "<div class='div-cell' style='width: 10%; vertical-align: middle;'>";
                  lst += distance + " km";
                  lst += "</div>"; // cell
                  lst += "</div>"; // row
                  lst += "</div>"; // table
                  lst += "</li>";

                  $('#pub-list').find('ul').append(lst);
                }
            }
        });
      // },1);
    };

  function get_location(location){
    var options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };

    if(navigator.geolocation){
      console.log('nav availaible');

      navigator.geolocation.getCurrentPosition(function(position){
          location.status = -1;
          location.latitude = position.coords.latitude;
          location.longitude = position.coords.longitude;
          console.log("in function \"navigator.geolocation.getCurrentPosition\":");
          console.log("Status: " + location.status);
          console.log("Latitude: " + location.latitude);
          console.log("Longitude: " + location.longitude);
        },
        function(err){
          location.status = 1;
          console.warn("ERROR: " + err.code + " " + err.message);
        }, 
        options);
    }
    else{
      // Browser doesn't support Geolocation
      location.status = 0;
      console.log('nav NOT availaible');
    }
  };


/*
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
*/
