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

    // $scope.selectedRun= function(id){
    //   console.log('selectedDate entered with id: ' + id);
    //
    //   $scope.thisDateRunDistance = [];
    //   $scope.thisDateRunDuration = [];
    //   $scope.thisDateRunPace = [];
    //   $scope.thisDateRunMoneyRaised = [];
    //   $scope.thisDateRunLaps = [];
    //   $scope.thisDateRunPath = [];
    //
    //   for(var i=0; i< $scope.listRuns.length; i++){
    //     if($scope.listRuns[i].id == id){
    //       console.log('ids matched with values : ' + $scope.listRuns[i].id + '   ' + id);
    //       console.log('selectedDate: Date and $scope.listRuns[i].Date[i] matched with values: ' + $scope.listRuns[i].Date + ' ' + date);
    //       // var thisRunDateCoords = [];
    //
    //       console.log('selectedDate: $scope.distances[i]: ' + $scope.listRuns[i].Distance);
    //       console.log('selectedDate: $scope.listRuns[i].duration: ' + $scope.listRuns[i].Duration);
    //       console.log('selectedDate: $scope.pace: ' + $scope.listRuns[i].Pace);
    //       console.log('selectedDate: $scope.moneyRaised: ' + $scope.listRuns[i].moneyRaised);
    //       console.log('selectedDate: $scope.paths: ' + $scope.listRuns[i].paths);
    //       console.log('selectedDate: $scope.laps['+i+']: ' + $scope.listRuns[i].laps);
    //
    //
    //       $scope.thisDateRunDuration.push($scope.listRuns[i].Duration);
    //       $scope.thisDateRunDistance.push($scope.listRuns[i].Distance);
    //       $scope.thisDateRunPace.push($scope.listRuns[i].Pace);
    //       $scope.thisDateRunMoneyRaised.push($scope.listRuns[i].moneyRaised);
    //       $scope.thisDateRunPath.push($scope.listRuns[i].Path);
    //       $scope.thisDateRunLaps.push($scope.listRuns[i].laps);
    //
    //       console.log('selectedDate: $scope.thisRunDistance: ' + $scope.thisDateRunDistance);
    //       console.log('selectedDate: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
    //       console.log('selectedDate: $scope.thisDateRunPace: ' + $scope.thisDateRunPace);
    //       console.log('selectedDate: $scope.thisDateRunMoneyRaised: ' + $scope.thisDateRunMoneyRaised);
    //       console.log('selectedDate: $scope.thisDateRunPath: ' + $scope.thisDateRunPath);
    //       console.log('selectedDate: $scope.thisDateRunLaps: ' + $scope.thisDateRunLaps);
    //
    //
    //       $rootScope.$broadcast("setDayValues");
    //     }
    //
    //   }
    //
    //   // HistoryAPI.setValuesForDayHistory(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
    //   //   $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
    //   //   $scope.thisDateRunPath, $scope.thisDateRunLaps);
    //   $rootScope.setHistoryDayValues(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
    //     $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
    //     $scope.thisDateRunPath, $scope.thisDateRunLaps);
    //
    //   $window.location.href = ('#/app/historyDay');
    //
    //
    //
    // }



  });
