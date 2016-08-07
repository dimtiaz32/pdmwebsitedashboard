/**
 * Created by dev on 7/20/16.
 */


angular.module('starter.historyServices', [])

.factory('HistoryAPI', function($ionicLoading,$rootScope, $http, $window, SERVER_HOST){
  var base= "http://localhost:5000/";
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

  $rootScope.setRunIdDayView = function(id){
    $rootScope.dayRunId = id;
  };

  $rootScope.fetchRunId = function(){
    $rootScope.$broadcast('fetchRunById');
  }

  return {


    getAll: function(user){
      return $http.get(SERVER_HOST+'history/', {
        method: 'GET',
        params: {
          user: user
        }
      });
    },
    getById: function(user, runId){
      return $http.get(base+'history/id', {
        method: 'GET',
        params: {
          user: user,
          runId: runId
        }
      });
    },
    getByWeek: function(userId){
      return $http.get(base+'history/week',  {
        method:'POST',
        params: {
          userId: userId
        }
      });
    },
    getByMonth: function(user, month){
      return $http.get(SERVER_HOST+'history/month', {
        method: 'GET',
        params: {
          user: user,
          month: month
        }
      });
    },

    getByMonthAndCharity: function(userId, form){
      return $http.get(base+'history/charity/month', form, {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getByDay: function(userId, month, day){
      return $http.get(SERVER_HOST+'history/day', {
        method: 'GET',
        params: {
          userId: userId,
          month: month,
          day: day
        }
      });
    },
    getCharityHistory: function(userId, charityName){
      return $http.get(SERVER_HOST+'history/charity', {
        method: 'GET',
        params: {
          userId: userId,
          charityName: charityName
        }
      });
    }
    // getPastCharities: function(userId){
    //   return $http.get(base+'history/charities', {
    //     method: 'GET',
    //     params: {
    //       userId: userId
    //     }
    //   });
    // }
  }

});
