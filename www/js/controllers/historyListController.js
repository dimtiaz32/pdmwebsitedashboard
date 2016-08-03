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


  .controller('HistoryListCtrl', function($rootScope, $scope, $filter, $window,HistoryAPI, AuthAPI, $filter) {
    //date in mm/dd/yyyy format
    //charity
    //duration
    //distance
    //pace



    $scope.monthNumberToString = function(month){
      switch(month){
        case "01":
          monthString = "Jan";
          return monthString;
          break;
        case "02":
          monthString = "Feb";
          return monthString;
          break;
        case "03":
          monthString = "Mar";
          return monthString;
          break;
        case "04":
          monthString = "Apr";
          return monthString;
          break;
        case "05":
          monthString = "May";
          return monthString;
          break;
        case "06":
          monthString = "Jun";
          return monthString;
          break;
        case "07":
          monthString = "Jul";
          return monthString;
          break;
        case "08":
          monthString = "Aug";
          return monthString;
          break;
        case "09":
          monthString = "Sep";
          return monthString;
          break;
        case "10":
          monthString = "Oct";
          return monthString;
          break;
        case "11":
          monthString = "Nov";
          return monthString;
          break;
        case "12":
          monthString = "Dec";
          return monthString;
          break;
        default:
          console.log('could not match month number' + month + ' to string')
          break;
      }
    };
    $scope.listRuns = [{
      id: String,
      Date: String,
      Charity: String,
      Duration: String,
      Distance: Number,
      Pace: Number,
      moneyRaised: Number
    }];

    $scope.listRunsIds = [];
    $scope.listRunsDates = [];
    $scope.listRunsCharities = [];
    $scope.listRunsDurations = [];
    $scope.listRunsDistances = [];
    $scope.listRunsPaces = [];
    $scope.listRunsIds = [];

    $scope.thisDateRunDistance = [];
    $scope.thisDateRunDuration = [];
    $scope.thisDateRunPace = [];
    $scope.thisDateRunMoneyRaised = [];
    $scope.thisDateRunLaps = [];
    $scope.thisDateRunPath = [];

    $scope.listRunsLaps = [];
    $scope.listRunsPaths = [];

    $scope.list = [];


    $rootScope.$on('fetchAllHistory', function(){
      console.log('userId:' + $rootScope.getUserId());
      HistoryAPI.getAll($rootScope.getUserId())
        .success(function(data, status, headers, config){
          for(var i = 0; i< data.length; i++) {

            if (data[i].seconds < 10) {
              data[i].seconds = "0" + data[i].seconds.toString();
            }
            $scope.list.push(data[i]);
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
      console.log('selectedDate entered with id: ' + id);

      // $window.location.href = ('#/app/historyDay');



    }



  });
