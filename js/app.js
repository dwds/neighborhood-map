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

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.lat = ko.observable(data.location.lat);
  this.lng = ko.observable(data.location.lng);
}

var ViewModel = function () {
  var self = this;

  self.locationList = ko.observableArray([]);

  locations.forEach(function(location){
    self.locationList.push(new Location(location));
  });
}

ko.applyBindings(new ViewModel());
