/**
 * Created by dev on 8/3/16.
 */
angular.module('starter.addRaceController', [
  'starter.appController',
  'starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',
  'starter.historyServices',
  'starter.raceServices',
  'starter.runServices',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar',"ion-datetime-picker"])


.controller('AddRaceCtrl', function($rootScope, $scope, RaceAPI, $window, $timeout, $ionicModal, $window, $scope, CharityAPI){
 $scope.race = {
   date: "",
   name: "",
   distances: "",
   charityPartners: "",
   description: "",
   isFeatured: ""
 };

 $scope.createRace = function(){
   var date = this.race.date;
   var name = this.race.name;
   var distances = this.race.distances;
   var charityPartners = this.race.charityPartners;
   var description = this.race.description;
   var isFeatured = this.race.isFeatured;

   $rootScope.show('Please wait.. creating race');

   var form = {
     date: date,
     name: name,
     distances: distances,
     charityPartners: charityPartners,
     description: descriptions,
     created: Date.now()
   };

   RaceAPI.addRace(form)
     .success(function(data, status, headers, config){
        console.log('race successfully saved');
       console.log('race values: ' + data.date +' ' + data.name);
     })
     .error(function(err){
       console.log('Race API add race function failure with error: ' + err);

     })







 }


});
