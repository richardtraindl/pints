
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
                  lst += "<div class='div-table'>";
                  lst += "<div class='div-row' style='height: 40px; text-overflow: ellipsis;'>";
                  
                  lst += "<div class='div-cell' style='width: 5%; vertical-align: middle;'>";
                  lst += "<span style='font-size: 20px'>" + cnt.toString() + "&nbsp;</span>";
                  lst += "</div>"; // cell
                  
                  lst += "<div class='div-cell' style='width: 25%; vertical-align: middle;'>";
                  lst += pub.name + "<br>";
                  for(let tag of pub.tags){
                    lst += tag.tag + " ";
                  };
                  lst += "<br>";
                  lst += pub.food;
                  lst += "</div>"; // cell
                  
                  lst += "<div class='div-cell' style='width: 60%; vertical-align: middle;'>";
                  if(pub.features.length > 0){
                    lst += pub.features + "<br>";
                  }
                  if(pub.openings.length > 0){
                    lst += pub.openings + "<br>";
                  }
                  lst += pub.tel;
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

