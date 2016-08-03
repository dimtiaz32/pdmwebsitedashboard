/**
 * Created by dev on 8/3/16.
 */

angular.module('starter.raceServices', [])

  .factory('RaceAPI', function($ionicLoading,
                                  $rootScope, $http, $window){
    var base = "https://dreamrun.herokuapp.com/";

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

    return {
      addRace: function(form){
        return $http.post(base+'races/addRace', form);
      }
    }
  });
