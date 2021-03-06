/**
 * Created by dev on 8/3/16.
 */
angular.module('starter.myRacesController', [
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


  .controller('MyRacesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope,RaceAPI, RunAPI, HistoryAPI, AuthAPI, $ionicViewSwitcher){
    console.log('MyRacesCtrl entered: userId ' + $rootScope.getUserId());

    $scope.goBack = function() {
      //IonicViewSwitcher.nextDirection specifies the animation direction when switching page
      $ionicViewSwitcher.nextDirection('back');
      $window.location.href = ('#/app/races')
    };

    $scope.myRaces = [];
    $scope.raceDistances = [];
    RaceAPI.getUserRaces($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('RunAPI getUserRaces call succeeded');
        //check for data length before parsing
        if(data.length == 0){
          $scope.noRaces = true;
        } else {
          $scope.noRaces = false;

          for (var i = 0; i < data.length; i++) {
            $scope.raceName = data[i].name;
            $scope.raceDate = data[i].date;
            $scope.raceCity = data[i].city;

            console.log(data[i].distances);
            var distances = $scope.displayDistanceForRace(data[i]);

        $scope.myRaces.push({name: $scope.raceName, date: $scope.raceDate,
              city: $scope.raceCity, distances: distances,  _id: data[i]._id});
            console.log('myRacesDisplay: ' + JSON.stringify($scope.myRaces));
          }
        }

      })
      .error(function(status){
        console.log('RunAPI getUserRaces call failed with status: ' + status);

      });

    $scope.selectRace = function(id){
       console.log('selectRace entered with id: ' + id);
      $rootScope.setRaceId(id);
      $window.location.href = ('#/app/raceProfile');
    }

    $scope.displayDistanceForRace = function(race) {
      // console.log(race.distances)
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


  });
