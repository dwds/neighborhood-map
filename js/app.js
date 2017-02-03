var locations = [
  {
    name: 'Smoking Barrels',
    position: {
      lat: 38.578689,
      lng: -90.282242
    },
    instaID: 85031244,
    instaPic: {},
    type: [
      "PokeStop",
      "restaurant"
    ]
  },
  {
    name: 'Our Lady of Sorrows',
    position: {
      lat: 38.577946,
      lng: -90.28336
    },
    instaID: 220348989,
    instaPic: {},
    type: [
      "PokeStop",
      "church",
      "school"
    ]
  },
  {
    name: 'Pizzeria Tivoli',
    position: {
      lat: 38.577014,
      lng: -90.283338
    },
    instaID: 1339749,
    instaPic: {},
    type: [
      "restaurant"
    ]
  },
  {
    name: 'Onesta Pizza & Trattoria',
    position: {
      lat: 38.576575,
      lng: -90.286825
    },
    instaID: 2137382,
    instaPic: {},
    type: [
      "PokeStop",
      "restaurant"
    ]
  },
  {
    name: 'Salon Soha',
    position: {
      lat:  38.578382,
      lng: -90.285556
    },
    instaID: 69364819,
    instaPic: {},
    type: [
      "salon",
      "shop"
    ]
  },
  {
    name: 'South Side Cyclery',
    position: {
      lat:  38.568933,
      lng: -90.287165
    },
    instaID: 19110494,
    instaPic: {},
    type: [
      "shop"
    ]
  },
  {
    name: 'Gateway Science Academy South',
    position: {
      lat:  38.572118,
      lng: -90.283502
    },
    instaID: 568089953,
    instaPic: {},
    type: [
      "school"
    ]
  },
  {
    name: 'Fifth Spiritualist Church',
    position: {
      lat:  38.575149,
      lng: -90.283556
    },
    instaID: 548409982,
    instaPic: {},
    type: [
      "church",
      "PokeStop"
    ]
  }
];

locations.forEach(function(location) {
  location.infoContent = "loading…"
});

// Instagram API
// URL query parts
var ACCESS_TOKEN = config.IG_KEY; // Load API key from config file
var QUERY_BASE = "https://api.instagram.com/v1/locations/";
var QUERY_PATH = "/media/recent?access_token=" + ACCESS_TOKEN;

function getInstaPic(location) {
  $.ajax({
    // query Instagram API based on location ID
    url: QUERY_BASE + location.instaID + QUERY_PATH,
    dataType: "jsonp",
    success: function (result){
      if(result.meta.code === 200) {
        // got a good result (200 = OK)
        if(result.data.length > 0) {
          // if there is at least one pic, get info about first pic
          var data = result.data[0];
          var imgSrc = data.images.thumbnail.url;
          if(imgSrc) {
            // if data included the image thumbnail url
            location.instaPic.imgSrc = imgSrc;
            location.instaPic.imgLink = data.link || 'https://www.instagram.com/';
            location.instaPic.userLink = "https://www.instagram.com/";
            var userName = data.user.username;
            if(userName) {
              // if data included username
              location.instaPic.userName = userName;
              location.instaPic.userLink += userName;
            } else {
              location.instaPic.userName = 'unknown user';
            }
            location.instaPic.error = null;
          } else {
            // could not find image source
            location.instaPic.error = "Could not load Instagram image."
          }
        } else {
          // there were not any pics
          location.instaPic.error = "There are no Intagram pics tagged with this location!";
        }
      } else {
        // Something wrong with the query
        location.instaPic.error = "Could not access Instagram";
      }
      createInfoContent(location);
    },
    error: function (result, status, err){
      // ajax request failed
      location.instaPic.error = "Could not access Instagram";
      createInfoContent(location);
    }
  });
}

function createInfoContent(location) {
  var infoContent = '<div class="info-window">';
  infoContent += '<p class="info-title">' + location.name + '</p>';
  if(location.instaPic.error) {
    infoContent += '<p class="info-error">' + location.instaPic.error +
      '</p>';
  } else {
    infoContent += '<figure><a target="_blank" href="' +
      location.instaPic.imgLink + '"><img src="' + location.instaPic.imgSrc +
      '" alt="' + location.name + ' by Instagram user ' +
      location.instaPic.userName +
      '"></a><figcaption>Photo by <a target="_blank" href="' +
      location.instaPic.userLink + '">@' + location.instaPic.userName +
      '</a> on Instagram</figcaption></figure>';
  }
  infoContent += '</div>';

  // TODO: MOVE this
  // TODO: Use one infowindow and change its content on marker click
  // create infoWindow
  location.infoWindow = new google.maps.InfoWindow({
    content: infoContent
  });
}

/* Create an array of locationTypes based on location data.
 * For each location, loop through its type array and add
 * any new types to the locationTypes array.
 */
var locationTypes = ['all'];
$.each(locations, function(key, location) {
  $.each(location.type, function(key, type){
    if($.inArray(type ,locationTypes) === -1) {
      locationTypes.push(type);
    }
  });
});

// Google map
var mapEl = document.getElementById('map');

function mapError() {
  console.log("hey");
  var error = '<p class="error">Sorry, could not connect to Google Maps.</p>';
  mapEl.innerHTML = error;
}

var map;
function initMap() {
  // initialize map
  map = new google.maps.Map(mapEl, {
    center: {lat:  38.574149, lng: -90.283556},
    zoom: 16,
    scrollwheel: false // disable scrollwheel zoom
  });

  // keep map centered on window resize
  // credit: http://hsmoore.com/keep-google-map-v3-centered-when-browser-is-resized/
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

  // setup map info for each location
  $.each(locations, function(key, location) {
    // create marker, and place it on map by default
    location.marker = new google.maps.Marker({
      position: location.position,
      map: map,
      title: location.name,
      icon: "http://maps.google.com/mapfiles/marker" + location.name[0] + ".png"
    });
    location.marker.addListener('click', function() {
      showInfo(location);
    });
    getInstaPic(location);
  });
}

// center map on location, open its infoWindow, and animate its marker
function showInfo(location) {
  map.panTo(location.position);
  location.infoWindow.open(map, location.marker);
  if (location.marker.getAnimation() === null) {
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      location.marker.setAnimation(null);
    }, 700);
  }
}

var ViewModel = function () {
  var self = this;

  // initialize locationList as empty array
  self.locationList = ko.observableArray([]);

  // set filter to 'all' by default
  self.filter = ko.observable('all');

  // create initial locationList (all locations)
  locations.forEach(function(location){
    self.locationList.push(location);
  });

  // change the locationList based on the selected filter value
  self.filterLocations = function() {
    // clear locationList
    self.locationList([]);

    // if filter value is 'all', add all locations to locationList
    // and add all markers to the map
    if(self.filter() === 'all') {
      locations.forEach(function(location){
        self.locationList.push(location);
        location.marker.setMap(map);
      });
    } else {
      // for each location ...
      $.each(locations, function(key, location) {
        // if the selected filter value is its list of location types
        if($.inArray(self.filter(), location.type) > -1) {
          // add location to location list
          self.locationList.push(location);
          // add marker to map
          location.marker.setMap(map);
        } else {
          // remove marker from map
          location.marker.setMap(null);
        }
      });
    }
  };

  // when the filter value is changed, call the filterLocations method
  self.filter.subscribe(self.filterLocations);
};

// hook it all up
ko.applyBindings(new ViewModel());
