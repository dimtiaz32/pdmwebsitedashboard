/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.raceController', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',

  'starter.historyServices',

  'starter.runServices',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar'])


  .controller('RacesCtrl', function($scope, $window, RaceAPI) {
    //date of race
    //distance(s)
    //CharityPartners
    //Logo
    //B-g img
    //description
    //race updates/notifications

    $scope.createRacePage = function() {
      console.log('create race page clicked');
      $window.location.href = ('#/app/races/createRace');
    };

  })

  .controller('MyRacesCtrl', function($scope) {

  })

  .controller('FindRacesCtrl', function($scope) {
    /*Chips Stuff
     var self = this;
     this.readonly = false;
     this.match = true;
     this.tags = [];
     this.cities = ['Chicago', 'Baltimore', 'Arlington'];
     this.distances = ['5k', '10k', '15k'];
     this.possibleCities = ['Washington', 'Duluth', 'New York', 'Boston'];
     this.possibleDistances = ['20k', '25k', '30k'];
     this.newChip= function(chip) {
     return chip;
     };
     */

    /*Contact Chips -- Cities*/
    this.cityQuerySearch = function(query) {
      var results = query ? this.allCities.filter(createFilterForCities(query)) : [];
      return results;
    };

    this.allCities = loadCities();
    this.cities = [this.allCities[0]];
    this.filterSelected = true;


    function createFilterForCities(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(city) {
        return (city.lowercaseName.indexOf(lowercaseQuery) != -1);
      };
    }

    function loadCities() {
      var cities = [
        'New York',
        'Boston',
        'Arlington',
        'Washington',
        'Baltimore',
        'Duluth',
        'Montpelier',
        'Richmond',
        'Dover'
      ];
      return cities.map(function (c, index) {
        var cParts = c.split(' ');
        var city = {
          name: c,
        };
        city.lowercaseName = city.name.toLowerCase();
        return city;
      });
    }
    /*Contact Chips -- distances*/
    this.distanceQuerySearch = function (query) {
      var results = query ? this.allDistances.filter(createFilterForDistances(query)) : [];
      return results;
    };

    this.allDistances = loadDistances();
    this.distances = [this.allDistances[0]];

    function createFilterForDistances(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(distance) {
        return (distance.lowercaseName.indexOf(lowercaseQuery) != -1);
      };
    }

    function loadDistances() {
      var distances = [
        '5k',
        '10k',
        '15k',
        '20k',
        '25k'
      ];
      return distances.map(function (d, index) {
        var dParts = d.split(' ');
        var distance = {
          name: d,
        };
        distance.lowercaseName = distance.name.toLowerCase();
        return distance;
      });
    }

    /*End Chips Stuff*/
  })

  .controller('PastRacesCtrl', function($scope) {


  });
