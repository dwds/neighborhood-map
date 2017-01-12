var locations = [
  {
    name: 'Smoking Barrels',
    position: {
      lat: 38.579166,
      lng: -90.28124
    },
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
    type: [
      "church",
      "PokeStop"
    ]
  }
];

/* Create an array of locationTypes based on location data.
 * For each location, loop through its type array and add
 * any new types to the locationTypes array.
 */
var locationTypes = ['all'];
$.each(locations, function(key, location) {
  $.each(location.type, function(key, type){
    if($.inArray(type ,locationTypes) === -1) {
      locationTypes.push(type)
    }
  });
});


// Google map
var map;
function initMap() {
  // initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.579166, lng: -90.28124},
    zoom: 15
  });
  // setup map info for each location
  $.each(locations, function(key, location) {
    // create marker, and place it on map by default
    location.marker = new google.maps.Marker({
      position: location.position,
      // setting map value to null will remove marker from map
      map: map,
      title: location.name,
      label: location.name[0]
    });
    // create infoWindow
    location.infoWindow = new google.maps.InfoWindow({
      content: location.name
    });
    // TODO: separate this out into a named function
    // when marker is clicked, animate it and open its infoWindow
    location.marker.addListener('click', function() {
      location.infoWindow.open(map, location.marker);
      if (location.marker.getAnimation() == null) {
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
          location.marker.setAnimation(null);
        }, 700);
      }
    });
  });
}

// TODO: create location object constructor

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
}

// hook it all up
ko.applyBindings(new ViewModel());
