/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.raceController', ['starter.appServices',
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


  .controller('RacesCtrl', function($scope, $window, RaceAPI) {
    //date of race
    //distance(s)
    //CharityPartners
    //Logo
    //B-g img
    //description
    //race updates/notifications

    $scope.createRacePage = function() {
      console.log('create race page clicked');
      $window.location.href = ('#/app/races/createRace');
    };

  })

  .controller('MyRacesCtrl', function($scope) {

  })

  .controller('FindRacesCtrl', function($scope) {

  })

  .controller('PastRacesCtrl', function($scope) {


  });
