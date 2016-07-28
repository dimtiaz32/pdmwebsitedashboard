/**
 * Created by dev on 6/29/16.
 */


angular.module('starter.authServices', ['ngCookies'])

.factory('AuthAPI', function($rootScope, $http, $window, $ionicLoading, $cookies){

  var base = "http://localhost:5000/";

  //var base = "https://dreamrun.herokuapp.com/authentication";

  $rootScope.verifyStatus = function(status) {
     if (status == "401") {
       $window.location.href = "#/auth/signin";
     }
  }

  $rootScope.show = function (text) {
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
    $cookies.put('token', token);
  };

  $rootScope.getToken = function(){
    //TODO: TRY PASSING A JSON CALL TO GET TOKEN AND SET IT HERE. MIGHT BE A BAD IDEA SECURITY WISE?
    return $cookies.get('token')
  };

  $rootScope.removeToken = function(){
    $cookies.put('token', null);
  };


  $rootScope.setEmail = function(email){
    return  $window.localStorage.email = email;
  };

  $rootScope.getEmail = function(){
    return $window.localStorage.email;
  };

  // $rootScope.setName = function(firstName, lastName){
  //   return $window.localStorage.name = firstName + ' ' + lastName;
  // };
	//
  // $rootScope.getName = function(){
  //   return $window.localStorage.name;
  // };

  $rootScope.setPassword = function(password){
    return $window.localStorage.password = password;
  };
  $rootScope.getPassword = function(){
    return $window.localStorage.password;
  };

  $rootScope.setName = function(name){
    return $window.localStorage.name  = name;
  };

  $rootScope.getName = function(){
    return $window.localStorage.name;
  };

  $rootScope.setHistory = function(history){
    return $window.localStorage.history = history;
  };

  $rootScope.getHistory  = function(){
    return $window.localStorage.history;
  };

  $rootScope.setUpdatedAt = function(updatedAt){
    return $window.localStorage.updatedAt = updatedAt;
  };

  $rootScope.getUpdatedAt = function() {
    return $window.localStorage.updatedAt;
  };

  $rootScope.setCreatedAt = function(created){
    return $window.localStorage.created = created;
  };

  $rootScope.getCreatedAt = function(){
    return $window.localStorage.created;
  };

  $rootScope.setSelectedCharity = function(charity){
    return $window.localStorage.selectedCharity = charity;
  };

  $rootScope.getSelectedCharity = function(){
    return $window.localStorage.selectedCharity;
  };

  $rootScope.setUserId = function(userId){
    $window.localStorage.userId = userId;
  };

  $rootScope.getUserId = function(){
    return $window.localStorage.userId;
  };

  $rootScope.setAvatar = function(avatar) {
    $window.localStorage.avatar = avatar;
  }

  $rootScope.getAvatar = function() {
    return $window.localStorage.avatar;
  }

  $rootScope.clearAll = function() {
      $window.localStorage.clear();
      $cookies.remove();
  }

  // $rootScope.setCharity = function(charity){
  //   return $window.localStorage.selectedCharity = charity;
  // };
  //
  // $rootScope.getCharity = function(){
  //   return $window.localStorage.charity;
  // };

  // $rootScope.logout = function(){
  //   $rootScope.setToken("");
  //   $window.location.href = '#/auth/signin';
  // };




  return {
    signin: function(form){
      return $http.post(base + 'authentication/signin', form);
    },
    signup: function(form){
      console.log("form:" + JSON.stringify(form));
      return $http.post(base + 'authentication/signup', form);
    },
    signout: function(){
      return $http.get(base + 'authentication/signout', {
        method: 'GET'
      });
    },
    signinByFB: function(form) {
      return $http.post(base + 'authentication/facebook',form);
    },
    signinByGG: function(form) {
      return $http.post(base + 'authentication/google',form);
    }
  }
});
