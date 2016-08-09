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


  .controller('MyRacesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope,RaceAPI, RunAPI, HistoryAPI, AuthAPI){
    console.log('MyRacesCtrl entered: userId ' + $rootScope.getUserId());
    $scope.myRaces = [];

    RaceAPI.getUserRaces($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('RunAPI getUserRaces call succeeded');
        //check for data length before parsing
        for(var i=0; i< data.length; i++){
          var tempDistances = data[i].distances;
          dSplit = tempDistances.to

          $scope.myRaces.push(data[i]);
        }
        if(data.length == 0){
          $scope.noRaces = true;
        } else{
          $scope.noRaces = false;
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


  });
