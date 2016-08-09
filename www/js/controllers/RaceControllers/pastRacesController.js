/**
 * Created by dev on 8/3/16.
 */
angular.module('starter.pastRacesController', [
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


  .controller('PastRacesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, RaceAPI, CharityAPI, HistoryAPI, AuthAPI){
    $scope.pastRacesDisplay = [];
    $scope.raceDistances = [];

    RaceAPI.getPastRaces($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('RaceAPI getPastRaces succeeded');
        console.log('getPastRaces data.length: ' + data.length);

        for(var i=0; i< data.length; i++) {
          $scope.raceName = data[i].name;
          $scope.raceDate = data[i].date;
          $scope.raceCity = data[i].city;
          // $scope.raceDistances = data.distances;
          console.log(data[i].distances);
          var tempDistanceHolder = data[i].distances;
          var distanceSplit = tempDistanceHolder.toString().split(',');
          console.log('distanceSplit: ' + distanceSplit);
          if (distanceSplit.length > 0) {
            for (var i = 0; i < distanceSplit.length; i++) {
              var fDistance = distanceSplit[i];
              $scope.raceDistances.push({distance: fDistance});

            }

          }

          $scope.pastRacesDisplay.push({name: $scope.raceName, date: $scope.raceDate,
            city: $scope.raceCity});
          console.log('pastRacesDisplay: ' + JSON.stringify($scope.pastRacesDisplay));
        }
      })
      .error(function(err, status){
        console.log('RaceAPI getPastRaces failed with status: ' + status + '   and error: ' + err);
      });


    $scope.selectRace = function(id){
      console.log('selectRace entered with id: ' + id);
      $rootScope.setRaceId(id);
      $window.location.href = ('#/app/raceProfile');
    }

    $scope.displayDistances = function(distances) {
      distanceString = "";
      for (var i = 0; i < distances.length; i++) {
        distanceString += (distances[i].distance + "km");
        if (i < (distances.length - 1)) {
          distanceString += ", "
        }
      }
      return distanceString;
    }

  });
