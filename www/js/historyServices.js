/**
 * Created by dev on 7/20/16.
 */


angular.module('starter.historyServices', [])

.factory('HistoryAPI', function($ionicLoading,
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
  //
  // $rootScope.clearHistoryDayValues = function(){
  //   return {
  //     date: $window.localStorage.hDayDate = "",
  //     distance: $window.localStorage.hDayDistance = "",
  //     duration: $window.localStorage.hDayDuration = "",
  //     pace: $window.localStorage.hDayPace = "",
  //     moneyRaised: $window.localStorage.hDayMoneyRaised = "",
  //     path: $window.localStorage.hDayPath = "",
  //     laps: $window.localStorage.hDaylaps = ""
  //   }
  // }
  // $rootScope.setHistoryDayValues = function(date, distance, duration, pace, moneyRaised,
  //                                   path, laps){
  //   return {
  //     date: $window.localStorage.hDayDate = date,
  //     distance: $window.localStorage.hDayDistance = distance,
  //     duration: $window.localStorage.hDayDuration = duration,
  //     pace: $window.localStorage.hDayPace = pace,
  //     moneyRaised: $window.localStorage.hDayMoneyRaised = moneyRaised,
  //     path: $window.localStorage.hDayPath = path,
  //     laps: $window.localStorage.hDaylaps = laps
  //   }
  // }
  // $rootScope.getDayHistoryValues = function(){
  //   return {
  //     date: $window.localStorage.hDayDate,
  //     distance: $window.localStorage.hDayDistance,
  //     duration: $window.localStorage.hDayDuration,
  //     pace: $window.localStorage.hDayPace,
  //     moneyRaised: $window.localStorage.hDayMoneyRaised,
  //     path: $window.localStorage.hDayPath,
  //     laps: $window.localStorage.hDaylaps
  //   }
  // }



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
    getByDay: function(userId, month, day){
      return $http.get(base+'history/day', {
        method: 'GET',
        params: {
          userId: userId,
          month: month,
          day: day
        }
      });
    },
    getCharityHistory: function(userId, charityName){
      return $http.get(base+'history/charity', {
        method: 'GET',
        params: {
          userId: userId,
          charityName: charityName
        }
      });
    },
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
