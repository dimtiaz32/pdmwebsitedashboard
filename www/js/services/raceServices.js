/**
 * Created by dev on 8/3/16.
 */

angular.module('starter.raceServices', [])

  .factory('RaceAPI', function($ionicLoading,
                                  $rootScope, $http, $window){
    // var base = "https://dreamrun.herokuapp.com/";
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


    $rootScope.setRaceId = function(id){
      $rootScope.selectedRaceId = id;
    };

    return {
      addRace: function(form){
        return $http.post(base+'races/addRace', form);
      },
      getFeaturedRaces: function(feat){
        return $http.get(base+'races/featured', {
          method: 'GET',
          params: {
            feat: feat
          }
        });
      },
      getRaceById: function(id){
        return $http.get(base+'races/raceId', {
          method: 'GET',
          params: {
            id: id
          }
        });
      },
      joinRace: function(userId, raceId){
        console.log('userId: ' + userId);
        console.log('raceAPI raceId: ' + raceId);
        return $http.put(base+'races/users', userId, {
          method: 'PUT',
          params: {
            raceId: raceId
          }
        });
      }
    }
  });
