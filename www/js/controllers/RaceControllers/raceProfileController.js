/**
 * Created by dev on 8/3/16.
 */


angular.module('starter.raceProfileController', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',
  'starter.historyServices',
  'starter.raceServices',
  'starter.runServices',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar'])



  .controller('RaceProfileCtrl', function($scope, $rootScope,$window, RaceAPI, AuthAPI, RaceAPI, $ionicLoading, $ionicSlideBoxDelegate, $timeout) {
    $rootScope.selectedRaceId;
    console.log('$rootScope.selectedRaceId from RaceProfileCtrl: ' + $rootScope.selectedRaceId);

    $scope.race = [];
    RaceAPI.getRaceById($rootScope.selectedRaceId)
      .success(function(data, status, headers, config){

        $scope.raceName = data.name;
        $scope.raceDate = data.date;
        $scope.raceDistances = data.distances;
        $scope.raceCharityPartners = data.charityPartners;
        $scope.raceDescription = data.description;

        // $scope.race.push(data[0]);
        //
        // console.log('$scope.race[0]: ' + $scope.race[0]);
        // console.log('$scope.race[0]: ' + $scope.race[0].name);
        // console.log('$scope.race[0]: ' + $scope.race[0]._id);
        // if(data.length == 1){
        //   $scope.race.push(data[0]);
        //   console.log('data[0]: ' + data[0]);
        //   console.log('$scope.race[0]: ' + $scope.race[0]);
        // } else {
        //   console.log('race id ' + $rootScope.selectedRaceId + 'returned more than one object: ' + data.length);
        // }
      })
      .error(function(status){
        console.log('RaceAPI getRaceById call failed with status: ' + status);
      });

    $scope.registerForRace = function(){
      $rootScope.show("Registering race");
      console.log('$rootScope.getRaceId: ' + $rootScope.selectedRaceId);
      var raceId = $rootScope.selectedRaceId;
      var userId = $rootScope.getUserId();
      console.log('userID: ' + userId);
      console.log('raceId: ' + raceId);
      RaceAPI.joinRace({userId: userId}, raceId)
        .success(function(data, status, headers, config){
          console.log('RaceAPI join race call');
          console.log('data: ' + data);
          $rootScope.hide();
        })
        .error(function(status){
          console.log('RaceAPI join race call failed with status: ' + status);
          $rootScope.notify("Oops! Unable to register for race!");
        });

    }

  });
