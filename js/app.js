var locations = [
  {
    name: 'Smoking Barrels',
    location: {
      lat: -90.28124,
      lng: 38.579166
    }
  },
  {
    name: 'Our Lady of Sorrows',
    location: {
      lat: -90.28336,
      lng: 38.577946
    }
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
