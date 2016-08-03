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

  .controller('HistoryDayCtrl', function($scope, $rootScope, $window, HistoryAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout, $ionicPopup){
    console.log('history day controller entered with run id: ' + $rootScope.dayRunId);
  });
