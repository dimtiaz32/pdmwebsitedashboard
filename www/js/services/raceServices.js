/**
 * Created by dev on 8/3/16.
 */

angular.module('starter.raceServices', [])

  .factory('RaceAPI', function($ionicLoading,
                                  $rootScope, $http, $window, SERVER_HOST){

    var base = "http://localhost:5000/";
    $rootScope.show = function(text){
      $rootScope.loading = $ionicLoading.show({
        template:'<ion-spinner icon="ripple" class="spinner"></ion-spinner>',
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
      $window.localStorage.selectedRaceId = id;
    };

    $rootScope.getRaceId = function(){
      return $window.localStorage.selectedRaceId;
    }

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
      },
      getPastRaces: function(userId){
        return $http.get(SERVER_HOST+'races/usersPast', {
          method: 'GET',
          params: {
            userId: userId
          }
        });
      },
      removeRace: function(raceId, userId){
        return $http.delete(SERVER_HOST+'races/myRaces',  {
          method: 'DELETE',
          params: {
            raceId: raceId,
            userId: userId
          }
        });
      }
    }
  });
