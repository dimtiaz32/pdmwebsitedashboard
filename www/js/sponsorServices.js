/**
 * Created by dev on 6/30/16.
 */


angular.module('starter.sponsorServices', ['ionic'])
.factory('SponsorAPI', function($rootScope, $http, $ionicLoading, $window){
  var base = "http://localhost:5000/";

  //everything up until return should be put in a main API
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

  $rootScope.setToken = function(token){
    return $window.localStorage.token = token;
  };

  $rootScope.getToken = function(token){
    return $window.localStorage.token;
  };

  return{
    getAll: function(token,userId){
      return $http.get(base+'donations/sponsors', {
        method: 'GET',
        params: {
          token: token,
          userId:userId
        }
      });
    }
  }
});
