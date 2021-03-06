/**
 * Created by dev on 8/3/16.
 */
angular.module('starter.findRacesController', [
  'starter.appController',
  'starter.appServices',
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


  .controller('FindRacesCtrl', function($rootScope, RaceAPI, $ionicModal, $window, $scope, CharityAPI, HistoryAPI, AuthAPI, $ionicFilterBar, $ionicViewSwitcher){
    console.log('FindRacesCtrl entered with userId: ' +$rootScope.getUserId());

    $scope.goBack = function() {
      //IonicViewSwitcher.nextDirection specifies the animation direction when switching page
      $ionicViewSwitcher.nextDirection('back');
      $window.location.href = ('#/app/races')
    };

    $scope.races = [];

    RaceAPI.getAllRaces()
      .success(function(data, status, headers, config){
        console.log('RunAPI getAllRAces call succeeded');
        console.log('response: ' + data);
        console.log('data.length: ' + data.length);
        for(var i=0; i<data.length; i++){
          $scope.races.push(data[i]);
        }

        $rootScope.hide();

        for (var i = 0; i < $scope.races.length; i++) {
          console.log($scope.races[i].keyWords);
        }
      })
      .error(function(status){
        console.log('RunAPI getAllRAces call failed with status: '+ status);
        $rootScope.hide();
      });

    $scope.selectRace = function(id){
      console.log('selectRace called with id: ' + id);
      $rootScope.setRaceId(id);
      $rootScope.show('Loading race information');
      $window.location.href = ('#/app/raceProfile');
    };

    $scope.displayDistanceForRace = function(race) {
      console.log(race.distances)
      distanceArray = race.distances.split(",");
      distanceString = "";
      for (var i = 0; i < distanceArray.length; i++) {
        distanceString += distanceArray[i];
        if (i < (distanceArray.length - 1)) {
          distanceString += ", ";
        }
      }
      return distanceString;
    };

    /*Filter Bar Stuff*/
    $scope.filteredRaces = $scope.races; //This changes once the user uses the filter bar

    var filterBarInstance;

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.races,
        update: function (filteredItems, filterText) {
          $scope.filteredRaces = filteredItems;
        },
        filterProperties: ['keyWords']
      });
    };

    $scope.selectRace = function(id){
      console.log('selectRace called with id: ' + id);
      $rootScope.setRaceId(id);
      $window.location.href = ('#/app/raceProfile');
    }

    $scope.addRaceUrl = 'https://www.projectdreammiles.com/#/races/add';

    $scope.goToAddRace = function (link) {
      window.open(link, '_system', 'location=yes');
    }

  });
