

  function calc_distance(long, lat, long1, lat1){
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

    return Math.round(d*10)/10; //  + " km";
  };


  function display_map(){
    var options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

    if(navigator.geolocation){
      console.log('nav availaible');

      navigator.geolocation.getCurrentPosition(function(position){
          location.latitude = position.coords.latitude;
          location.longitude = position.coords.longitude;

          show_pubs_map(location, 10);

          show_pub_list(location, 10);
        },
        function(err){
          console.warn("ERROR: " + err.code + " " + err.message);
          $('.msg').html('');
          var msg = "<p>" + err.message + " (" + err.code + ")</p>";
          $('.msg').append(msg);
        }, 
        options);
    }
    else{
      // Browser doesn't support Geolocation
      console.log('nav NOT availaible');
      $('.msg').html('');
      var msg = "<p>Browser doesn't support Geolocation. <br>Please check GPS-support!</p>";
      $('.msg').append(msg);
    }
  };


  function show_pubs_map(location, count){
    // map
    var mymap = L.map('mapid').setView([location.latitude, location.longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                   '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                   'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap);

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

      var cnt = 0;
      for(let rpub of rpubs){
        cnt += 1;
        if(cnt <= count){
          var distance = rpub[0];
          var pub = rpub[1];
          // map marker start
          var pub1 = L.marker([pub.latitude, pub.longitude]).addTo(mymap);
          var popup = cnt.toString() + ") &nbsp;"
          popup += pub.name + ", ";
          for(category of pub.categories){
            popup += category + " ";
          }
          popup += "<br>" + pub.address + "<br>"
          for(tel of pub.tel){
            popup += tel + " ";
          }
          if(pub.open.length > 0){
            popup += "<br>" + pub.open;
          }
          pub1.bindPopup(popup);
          // map marker end
        }
      }
      var redIcon = L.icon({
        iconUrl: '/styles/images/marker-red-icon.png',
        shadowUrl: '/styles/images/marker-shadow.png',
        iconSize:     [30, 40], // size of the icon
        shadowSize:   [41, 41], // size of the shadow
        iconAnchor:   [4, 38], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 39],  // the same for the shadow
        popupAnchor:  [10, -40] // point from which the popup should open relative to the iconAnchor
      });
      var userlocation = L.marker([location.latitude, location.longitude], {icon: redIcon}).addTo(mymap);
      userlocation.bindPopup("Here you are!").openPopup();
    });
  };


  function show_pub_list(location, count){
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

      // list
      $('#pub-list').html('');
      $('#pub-list').append("<ul></ul>");

      var cnt = 0;
      for(let rpub of rpubs){
        cnt += 1;
        if(cnt <= count){
          var distance = rpub[0];
          var pub = rpub[1];
          // list-item start
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
            lst += "<a href='tel:" + tel + "' style='color: Black'>" + tel + "</a> &nbsp; ";
          }
          lst += "</div>"; // cell

          lst += "<div class='div-cell' style='width: 10%; margin: 0px;'>";
          lst += distance + " km";
          lst += "</div>"; // cell
          lst += "</div>"; // row
          lst += "</li>";

          $('#pub-list').find('ul').append(lst);
          // list-item end
        }
      }
    });
  };

