/**
 * Created by dev on 7/20/16.
 */


angular.module('starter.historyServices', [])

.factory('HistoryAPI', function($rootScope, $ionicLoading, $http, $window, SERVER_HOST, CLIENT_HOST){

  $rootScope.show = function(text){
    $rootScope.loading = $ionicLoading.show({
      template:'<ion-spinner icon="ripple" class="spinner"></ion-spinner>',
      content: text ? text : 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
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
  };
  $rootScope.fetchHistory = function(){
    $rootScope.$broadcast('fetchHistory');
  };



  return {
    fetchHistory: function(){
      console.log('History API fetchHistory called');
      return $rootScope.$broadcast('fetchHistory');
    },

    getAll: function(user){
      return $http.get(SERVER_HOST+'history/', {
        method: 'GET',
        params: {
          user: user
        }
      });
    },
    getById: function(user, runId){
      return $http.get(SERVER_HOST+'history/id', {
        method: 'GET',
        params: {
          user: user,
          runId: runId
        }
      });
    },
    getByWeek: function(userId){
      return $http.get(SERVER_HOST+'history/week',  {
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

    getByMonthAndCharity: function(userId, charityId, month){
      return $http.get(SERVER_HOST+'history/charity/month',  {
        method: 'GET',
        params: {
          userId: userId,
          charityId: charityId,
          month: month
        }
      });
    },
    getWeekMoneyRaised: function(userId){
      return $http.get(SERVER_HOST+'history/week/moneyRaised', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getMonthMoneyRaised: function(userId){
      return $http.get(SERVER_HOST+'history/month/moneyRaised', {
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
