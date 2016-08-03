/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.historyDayController', [
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
  'angular-svg-round-progressbar',
  'Tek.progressBar'])

  .controller('HistoryDayCtrl', function($scope, $rootScope, $window, HistoryAPI, AuthAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout, $ionicPopup){
    console.log('history day controller entered with run id: ' + $rootScope.dayRunId);

        $scope.runArray = [];
        $scope.pathArray = [];
        $scope.lapArray = [];
        HistoryAPI.getById($rootScope.getUserId(), $rootScope.dayRunId)
          .success(function(data, status, headers, config){
            console.log('data length: ' + data.length);
            if(data.length == 1){

            } else {
              console.log('data returned more than one run with id: ' + $rootScope.dayRunId);
            }

          })
          .error(function(err){
            console.log('history API get by id failed with error: ' + err);
          });


  });
