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


  .controller('RacesCtrl', function($scope, $rootScope, AuthAPI, RaceAPI) {


  });
