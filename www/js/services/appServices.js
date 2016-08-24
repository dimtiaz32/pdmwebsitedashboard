/**
 * Created by dev on 6/28/16.
 */

angular.module('starter.appServices', ['starter.historyServices'])
  .factory('AppAPI', function($rootScope, $http, $ionicLoading, $window, SERVER_HOST, HistoryAPI) {

    //everything up until return should be put in a main API
    $rootScope.show = function (text) {
      $rootScope.loading = $ionicLoading.show({
        template:'<ion-spinner icon="ripple" class="spinner"></ion-spinner>',
        content: text ? text : 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
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
      if (tab == 1) {
        console.log('doRefresh APP API entered');
        $rootScope.$broadcast('resetWatch');
        $rootScope.$broadcast('newMap');
        $rootScope.$broadcast('initRun');

      } else
       if (tab == 2) {
         // $rootScope.setMapStatus(false);
         // $rootScope.$broadcast("removeFindingLocation");
        $rootScope.$broadcast('fetchHistory');
         // $rootScope.$broadcast('destroyWatch');
      }
      else if (tab == 3) {
         $rootScope.$broadcast('destroyWatch');
      }
       if (tab == 4) {
        $rootScope.$broadcast('fetchMonthHistory');
         $rootScope.$broadcast('destroyWatch');
      }
      else if (tab == 5) {
         // $rootScope.$broadcast('fetchCharities');
         $rootScope.$broadcast('destroyWatch');
      }
      else if(tab == 6) {
         $rootScope.$broadcast('destroyWatch');
     }

      // $rootScope.$broadcast('scroll.refreshComplete');
    }

    $rootScope.setMapStatus = function(mapStatus){
      $window.localStorage.mapStatus = mapStatus;
    }
    $rootScope.getMapStatus = function(){
      return $window.localStorage.mapStatus;
    }

    return {

    }
  });
