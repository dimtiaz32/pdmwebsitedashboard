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
   keywords: "",
   charityPartners: "",
   description: "",
   city: "",
   isFeatured: ""
 };

 $scope.createRace = function(){
   $scope.keyWords = [];
   keyWordSplit = $scope.race.keywords.toString().split(',');
   console.log('keyWord length: ' + keyWordSplit.length);
   for(var i = 0; i < keyWordSplit.length; i++){
     $scope.keyWords.push(keyWordSplit[i]);
     console.log('keyWordSplit['+i+']: ' + keyWordSplit[i]);
     $scope.keyWords[i];
   }
   var date = this.race.date;
   var name = this.race.name;
   var distances = this.race.distances;
   var keywords = $scope.keyWords;
   var charityPartners = this.race.charityPartners;
   var description = this.race.description;
   var city = this.race.city;
   console.log('$scope.race.isFeatured: ' +$scope.race.isFeatured);

   if($scope.race.isFeatured == "true"){
     var isFeatured = true;
   } else {
     var isFeatured = false;
   }
   // var isFeatured = this.race.isFeatured;

   console.log('isFeatured: ' + isFeatured);

   $rootScope.show('Please wait.. creating race');


   RaceAPI.addRace({
     date: date,
     name: name,
     distances: distances,
     keyWords: keywords,
     charityPartners: charityPartners,
     description: description,
     city: city,
     isFeatured: isFeatured

   })
   .success(function(data, status, headers, config){
      console.log('race successfully saved');
      console.log(status);
     $rootScope.hide();
   })
   .error(function(err){
     console.log('Race API add race function failure with error: ' + err);
     $rootScope.hide();

   });

   $scope.selectRace = function(id){
     console.log('select race entered with id: ' + id);
     $rootScope.setRaceId(id);
     $window.location.href = ('#/app/raceProfile');
   }







 }


});
