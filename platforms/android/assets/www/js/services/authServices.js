/**
 * Created by dev on 6/29/16.
 */


angular.module('starter.authServices', ['ngCookies'])

.factory('AuthAPI', function($rootScope, $http, $window, $ionicLoading, $cookies, SERVER_HOST, CLIENT_HOST){
  // var base = 'https://dreamrun.herokuapp.com/';
  var base="http://localhost:5000/";

  $rootScope.verifyStatus = function(status) {
     if (status == "401") {
       $window.location.href = "#/auth/signin";
     }
  }

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

  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  $rootScope.notify = function(text){
    $rootScope.show(text);
    $window.setTimeout(function(){
      $rootScope.hide();
    }, 1999);
  };

  $rootScope.setAutoLogin = function(autoLogin){
    $window.localStorage.autoLogin = autoLogin;
  };

  $rootScope.getAutoLogin = function(){
    return $window.localStorage.autoLogin;
  }
  $rootScope.setToken = function(token){
    // $cookies.put('token', token);
    $window.localStorage.token = token;

  };

  $rootScope.getToken = function(){
    //TODO: TRY PASSING A JSON CALL TO GET TOKEN AND SET IT HERE. MIGHT BE A BAD IDEA SECURITY WISE?
    // return $cookies.get('token')
    return $window.localStorage.token;
  };

  $rootScope.removeToken = function(){
    // $cookies.remove('token');
    delete $window.localStorage.token;
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
    $window.localStorage.password = password;
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

  $rootScope.$on("fetchName", function(){
    return $window.localStorage.name;
  });

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
    $window.localStorage.selectedCharity = charity;
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
  };

  $rootScope.setDonorId = function(donorId){
    $window.localStorage.donorId = donorId;
  };
  $rootScope.getDonorId = function(){
    return $window.localStorage.donorId;
  };



  $rootScope.clearAll = function() {
    console.log("localStorage cleared");
    $window.localStorage.clear();
      $cookies.remove();
  };

  $rootScope.getSponsors = function() {
    $rootScope.$broadcast('fetchMySponsors');
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
      return $http.post(SERVER_HOST+'authentication/signin', form);
    },
    signup: function(form){
      return $http.post(SERVER_HOST+'authentication/signup', form);
    },
    signout: function(){
      return $http.post(SERVER_HOST + 'authentication/signout');
    },
    signinByFB: function(form) {
      return $http.post(SERVER_HOST + 'authentication/facebook',form);
    },
    signinByGG: function(form) {
      return $http.post(SERVER_HOST + 'authentication/google',form);
    },
    authenticationCheck: function(token, email) {
      $http.defaults.headers.common.authorization = token;

      return $http.get(SERVER_HOST + 'user/keepLoggedIn/authenticationCheck', {
        method: 'GET',
        params: {
          email: email
        }
      });
    }
  }
});
