/**
 * Created by dev on 8/3/16.
 */

angular.module('starter.raceServices', [])

  .factory('RaceAPI', function($ionicLoading,
                                  $rootScope, $http, $window, SERVER_HOST){
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
        return $http.post(SERVER_HOST+'races/addRace', form);
      },
      getAllRaces: function(userId){
        return $http.get(SERVER_HOST+'races/findRaces', {
          method:'GET',
          params: {
            userId: userId
          }
        });
      },
      getFeaturedRaces: function(feat){
        return $http.get(SERVER_HOST+'races/featured', {
          method: 'GET',
          params: {
            feat: feat
          }
        });
      },
      getRaceById: function(id){
        return $http.get(SERVER_HOST+'races/raceId', {
          method: 'GET',
          params: {
            id: id
          }
        });
      },
      joinRace: function(userId, raceId){
        console.log('userId: ' + userId);
        console.log('raceAPI raceId: ' + raceId);
        return $http.put(SERVER_HOST+'races/users', userId, {
          method: 'PUT',
          params: {
            raceId: raceId
          }
        });
      },
      getUserRaces: function(userId){
        return $http.get(SERVER_HOST+'races/users', {
          method: 'GET',
          params: {
            userId: userId
          }
        });
      }
    }
  });
