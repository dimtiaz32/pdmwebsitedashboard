/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.historyListController', [
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


  .controller('HistoryListCtrl', function($rootScope, $scope, $filter, $window, HistoryAPI, CharityAPI, AuthAPI, $filter, $ionicNavBarDelegate, $ionicViewSwitcher) {

    $scope.goBack = function() {
      $ionicViewSwitcher.nextDirection('back');
      $window.location.href = ('#/app/history')
    };

    $scope.list = [];
    $scope.getCharityName = function(id){
      console.log('getCharityNAme entered with id: ' + id);

      CharityAPI.getById(id)
        .success(function(data, status, headers, config){
          console.log('CharityAPI get by ID succeeded with data: ' + JSON.stringify(data));
          console.log('charity.name: ' + data.name);
          return data.name;
        })
        .error(function(err, status){
          console.log('CharityAPI get by ID failed with status: ' + status + ' and error: ' + err);
        });

    }

    $rootScope.$on('fetchAllHistory', function(){
      console.log('userId:' + $rootScope.getUserId());
      HistoryAPI.getAll($rootScope.getUserId())
        .success(function(data, status, headers, config){
          for(var i = 0; i< data.length; i++) {

            if (data[i].seconds < 10) {
              data[i].seconds = "0" + data[i].seconds.toString();
            }

            if(data[i].charity != undefined) {
              // data[i].charity =$scope.getCharityName();
              var char  = $scope.getCharityName(data[i].charity);
              console.log('data['+i+'].charity post get: ' + data[i].charity);
              console.log('char: ' + char);

              console.log('data['+i+'].charity post get: ' + data[i].charity);
              $scope.list.push(data[i], {charity: char});
              console.log('list: ' + JSON.stringify($scope.list));
            } else {
              $scope.list.push(data[i]);
              console.log('list: ' + JSON.stringify($scope.list));
            }

          }
        })
        .error(function(err){
          console.log('inside charity get all API call failure');
        })
        .finally(function(){
          console.log("Refresh Finally");
          $scope.$broadcast('scroll.refreshComplete');
        });
    });
    $rootScope.$broadcast('fetchAllHistory');

    $scope.selectedRun= function(id){
      $ionicViewSwitcher.nextDirection('forward');

      $rootScope.setRunIdDayView(id);
      console.log('selectedDate entered with id: ' + id);
      $rootScope.fetchRunId();
      $window.location.href = ('#/app/historyDay');




    }



  });
