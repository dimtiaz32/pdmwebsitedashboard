/**
 * Created by dev on 6/28/16.
 */

angular.module('starter.appServices', [])
  .factory('AppAPI', function($rootScope, $http, $ionicLoading, $window) {
    var base = "https://dreamrun.herokuapp.com";

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
  });
