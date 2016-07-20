/**
 * Created by dev on 7/2/16.
 */
angular.module('starter.runServices', ['ionic'])
.factory('RunAPI', function($rootScope, $http, $ionicLoading, $window){
  var base = "http://localhost:5000/";

  $rootScope.show = function(text){
    $rootScope.loading = $ionicLoading.show({
      content: text ? text : 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      delay: 0
    });
  };

  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  $rootScope.notify = function(text){
    $rootScope.show(text);
    $window.setTimeout(function(){
      $rootScope.hide();
    }, 1999);
  };

  $rootScope.setRunDistance = function(distance){
    return $window.localStorage.distance = distance;
  };

  $rootScope.getRunDistance = function(){
    return $window.localStorage.distance;
  };
  $rootScope.setRunMinutes = function(minutes){
    return $window.localStorage.runMinutes = minutes;
  };

  $rootScope.getRunMinutes = function(){
    return $window.localStorage.runMinutes;
  };

  $rootScope.setRunSeconds = function(seconds){
    return $window.localStorage.runSeconds = seconds;
  };

  $rootScope.getRunSeconds = function(){
    return $window.localStorage.runSeconds;
  };

  $rootScope.setRunTime = function(time){
    return $window.localStorage.time =  time;
  };
  $rootScope.getRunTime = function(){
    return $window.localStorage.time;
  };


  $rootScope.setRunPace = function(pace){
    return $window.localStorage.pace = pace;
  };

  $rootScope.getRunPace = function(){
    return $window.localStorage.pace;
  };
  $rootScope.setRunPath = function(coordinates){
    return $window.localStorage.runPath = coordinates
  };
  $rootScope.getRunPath = function(){
    return $window.localStorage.runPath;
  };
  $rootScope.setLapDistance = function(distance){
    return $window.localStorage.lapDistance = distance;
  };

  $rootScope.getLapDistance = function(){
    return $window.localStorage.lapDistance;
  };
  $rootScope.setLapMinutes = function(minutes){
    return $window.localStorage.lapMinutes = minutes;
  };

  $rootScope.getLapDistance = function(){
    return $window.localStorage.lapMinutes;
  };

  $rootScope.setLapSeconds = function(seconds){
    return $window.localStorage.lapSeconds = seconds;
  };

  $rootScope.getLapSeconds = function(){
    return $window.localStorage.lapSeconds;
  };

  $rootScope.setLapMinutes = function(minutes){
    return $window.localStorage.lapMinutes =  minutes;
  };
  $rootScope.getLapMinutes = function(){
    return $window.localStorage.lapMinutes;
  };


  $rootScope.setLapPace = function(pace){
    return $window.localStorage.lapPace = pace;
  };

  $rootScope.getLapPace = function(){
    return $window.localStorage.lapPace;
  };
  $rootScope.setLapPath = function(coordinates){
    return $window.localStorage.lapPath = coordinates;
  };
  $rootScope.getLapPath = function(){
    return $window.localStorage.lapPath;
  };

  $rootScope.setLapNumber = function(number){
    return $window.localStorage.lapNumber = number;
  }
  $rootScope.getLapNumber = function(){
    return $window.localStorage.lapNumber;
  };

  $rootScope.setLaps = function(laps){
    return $window.localStorage.laps = laps;
  };

  $rootScope.getLaps = function(){
    return $window.localStorage.laps;
  };


  return{

    saveRun: function(form){
      return $http.post(base+'history', form);
    }

  }
});
