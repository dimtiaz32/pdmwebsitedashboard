/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.appController', [
  'starter.historyController',
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



  .controller('AppCtrl', function($rootScope, $scope, $window, $filter, $ionicModal, $timeout, DonationAPI, CharityAPI, AuthAPI, $ionicNavBarDelegate) {

    $ionicNavBarDelegate.showBackButton(false);


    $scope.moneyRaised = 0;

    $scope.fetchMonthHistory = function(){
      console.log('fetchMonthHistory function called');
      $rootScope.$broadcast("fetchHistoryMonth");
    }

    $scope.onActivityTabSelect = function(){
      $rootScope.$broadcast('fetchMonthHistory');
    };

    $scope.fetchMyPledges = function() {
      $rootScope.$broadcast("fetchMyPledges");
    }

    $scope.fetchMySponsors = function() {
      $rootScope.$broadcast("fetchMySponsors");
    }




    $rootScope.$on('fetchMySponsors', function() {
      DonationAPI.getAllSponsors($rootScope.getUserId()).success(function(data, status, headers, config){
        $scope.sponsors = [];
        $scope.moneyRaisedHolder = [];

        if(data.length == 0) {
          return $scope.noSponsor = true;
        } else {
          for (var i = 0; i < data.length; i++) {
            $scope.sponsors.push(data[i]);
            $scope.moneyRaisedHolder.push(data[i].per_mile_donation);
            console.log('data[i].per_mile_donation values: ' + data[i].per_mile_donation);
            console.log('$scope.moneyRaisedHolder: ' + $scope.moneyRaisedHolder[i] + '    ' + $scope.moneyRaisedHolder);
            console.log('Money Raised Value before addition: ' + $scope.moneyRaised);
            $scope.moneyRaised += $scope.moneyRaisedHolder[i];
            console.log('Money raised Value post addition: ' + $scope.moneyRaised);
          }
          console.log('My Sponsors JSON returned value of: ' + $scope.sponsors);
          console.log('Money raised per mile final result: ' + $scope.moneyRaised);
          $rootScope.setMoneyRaisedPerMile($scope.moneyRaised);
          console.log('$scope.getMoneyRaised per mile: ' + $rootScope.getMoneyRaisedPerMile());
        }

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });

    $rootScope.$on('fetchMyPledges',function(){
      DonationAPI.getAllPledges($rootScope.getUserId()).success(function(data, status, headers, config){
        $scope.pledges = [];
        $scope.pledgeMoney = 0;
        for (var i = 0; i < data.length; i++) {
          $scope.pledges.push(data[i]);
          $scope.pledgeMoney = $scope.pledgeMoney + data[i].payment_amount;
        };
        if($scope.pledgeMoney == undefined){
          $scope.pledgeMoney =0;
        }

        if(data.length == 0) {
          $scope.noPledge = true;
        } else {
          $scope.noPledge = false;
        }

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });


    //history stuff
    var t = Date.now();
    var today = new Date(t);

    console.log('Today: ' +today );
    var utcToday= new Date(today.toUTCString());
    console.log('Today: ' + today + ' Converts to UTC string: ' + utcToday);
    var isoToday = new Date(today.toISOString());
    console.log('Today: ' + today + 'Converts to Iso string: ' + isoToday);
    var todaySplit = today.toString().split(' ');
    var todayMonth = todaySplit[1];
    console.log('Today month: '  + todayMonth);


    //log out
    $scope.logout = function() {
      $rootScope.clearAll();
      $rootScope.$broadcast('destroy');
      $window.location.href = "#/auth/signin";
    }

  });
