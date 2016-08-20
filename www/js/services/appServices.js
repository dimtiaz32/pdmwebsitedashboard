/**
 * Created by dev on 6/28/16.
 */

angular.module('starter.appServices', ['starter.historyServices'])
  .factory('AppAPI', function($rootScope, $http, $ionicLoading, $window, SERVER_HOST, HistoryAPI) {

    //everything up until return should be put in a main API
    $rootScope.show = function (text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        delay: 0
      });
    };

    $rootScope.hide = function () {
      $ionicLoading.hide();
    };

    $rootScope.notify = function (text) {
      $rootScope.show(text);
      $window.setTimeout(function () {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.doRefresh = function(tab) {
      // if (tab == 1) {
      //   //$rootScope.broadcast('fetchRaces')
      // } else
       if (tab == 2) {
        $rootScope.$broadcast('fetchHistory');
      }
      // else if (tab == 3) {
      //   $rootScope.$broadcast('');
      // }
      else if (tab == 4) {
        $rootScope.$broadcast('fetchMonthHistory');
      }
      else if (tab == 5) {
         $rootScope.$broadcast('fetchCharities');
      }
     //  else if(tab == 6) {
     //
     // }

      $rootScope.$broadcast('scroll.refreshComplete');
    }


    return {

    }
  });
