/**
 * Created by dev on 8/3/16.
 */
angular.module('starter.pastRacesController', [
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


  .controller('PastRacesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, HistoryAPI, AuthAPI){

  });
