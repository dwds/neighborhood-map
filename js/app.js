var locations = [
  {
    name: 'Smoking Barrels',
    location: {
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
    location: {
      lat: 38.577946,
      lng: -90.28336
    },
    type: [
      "PokeStop",
      "church",
      "school"
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

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.579166, lng: -90.28124},
    zoom: 15
  });
  $.each(locations, function(key, location) {
    location.marker = new google.maps.Marker({
      position: location.location,
      map: map,
      title: location.name
    });
  });
}

var ViewModel = function () {
  var self = this;

  self.locationList = ko.observableArray([]);

  self.filter = ko.observable('all');

  locations.forEach(function(location){
    self.locationList.push(location);
  });

  self.filter.subscribe(function() {
    self.locationList([]);
    if(self.filter() === 'all') {
      locations.forEach(function(location){
        self.locationList.push(location);
        location.marker.setMap(map);
      });
    } else {
      $.each(locations, function(key, location) {
        if($.inArray(self.filter(), location.type) > -1) {
          self.locationList.push(location);
          location.marker.setMap(map);
        } else {
          location.marker.setMap(null);
        }
      });
    }
  });
}

ko.applyBindings(new ViewModel());
