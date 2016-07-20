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
  }
  return{

    saveRun: function(form){
      return $http.post(base+'history', form);
    }

  }
});
