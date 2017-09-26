
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
        $.getJSON('/data/pubs.json', function(data){
            var rpubs = new Array();

            $.each(data, function(index, pub){
              var distance = calc_distance(location.longitude, location.latitude, pub.longitude, pub.latitude);
              rpubs.push([distance, pub]);
            });

            function compare_distance(a, b){
              if (a[0] < b[0]) return -1;
              if (a[0] > b[0]) return 1;
              return 0;
            };

            rpubs.sort(compare_distance);

            $('#pub-list').html('');
            $('#pub-list').append("<ul></ul>");

            var cnt = 0;
            for(let rpub of rpubs){
              cnt += 1;
              if(cnt <= count){
                  var distance = rpub[0];
                  var pub = rpub[1];

                  var lst = "<li>";
                  lst += "<div style='display: flex; align-items: center'>";

                  lst += "<div style='width: 4%; margin: 0px;'>";
                  lst += "<span style='font-size: 20px'>" + cnt.toString() + "</span>";
                  lst += "</div>"; // cell
                  
                  lst += "<div style='width: 20%; margin: 0px;'>";
                  if(pub.website.length > 0){
                    lst += "<a href='" + pub.website + "' target='_blank' style='font-weight: bold'>" + pub.name + "</a><br>";
                  }
                  else{
                    lst += "<span style='font-weight: bold'>" + pub.name + "</span><br>";
                  }
                  for(category of pub.categories){
                    lst += category + " ";
                  }
                  if(pub.food.length > 0){
                    lst += "<br>" + pub.food;
                  }
                  lst += "</div>"; // cell

                  lst += "<div class='div-cell' style='width: 66%; margin: 0px;'>";
                  if(pub.features.length > 0){
                    lst += pub.features + "<br>";
                  }
                  if(pub.open.length > 0){
                    lst += pub.open + "<br>";
                  }
                  for(tel of pub.tel){
                    lst += "<a href='tel:" + tel + "' style='color: #FFFFFF'>" + tel + "</a> &nbsp; ";
                  }
                  lst += "</div>"; // cell

                  lst += "<div class='div-cell' style='width: 10%; margin: 0px;'>";
                  lst += distance + " km";
                  lst += "</div>"; // cell
                  lst += "</div>"; // row
                  lst += "</li>";

                  $('#pub-list').find('ul').append(lst);
                }
            }
        });
      // },1);
    };

  function get_location(location){
    var options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

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

