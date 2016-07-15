/**
 * Created by dev on 6/29/16.
 */


angular.module('starter.authServices', [])

.factory('AuthAPI', function($rootScope, $http, $window, $ionicLoading){
  //var base = "https://dreamrun.herokuapp.com/authentication";
  var base = "http://localhost:5000/authentication";

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
  $rootScope.setToken = function(token){
    return $window.localStorage.token = token;
  };

  $rootScope.getToken = function(){
    //TODO: TRY PASSING A JSON CALL TO GET TOKEN AND SET IT HERE. MIGHT BE A BAD IDEA SECURITY WISE?
    return $window.localStorage.token;
  };



  // $rootScope.logout = function(){
  //   $rootScope.setToken("");
  //   $window.location.href = '#/auth/signin';
  // };

  $rootScope.notify = function (text) {
    $rootScope.show(text);
    $window.setTimeout(function () {
      $rootScope.hide();
    }, 1999);
  };


  return {
    signin: function(form){
      return $http.post(base+'/signin', form);
    },
    signup: function(form){
      return $http.post(base+'/signup', form);
    },
    signout: function(token){
      return $http.get(base+'/signout', {
        method: 'GET',
        params: {
          token: token
        }
      });
    }

  }
});
