/**
 * Created by dev on 7/20/16.
 */


angular.module('starter.historyServices', [])

.factory('HistoryAPI', function($ionicLoading, $rootScope, $http, $window){
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
    getAll: function(user){
      return $http.get(base+'history/', {
        method: 'GET',
        params: {
          user: user
        }
      });
    },
    getByMonth: function(user, month){
      return $http.get(base+'history/month', {
        method: 'GET',
        params: {
          user: user,
          month: month
        }
      });
    },
    getCharityHistory: function(userId, charityName){
      return $http.get(base+'history/charity', charityName, {
        method: 'GET',
        params: {
          user: userId
        }
      });
    }
  }

});
