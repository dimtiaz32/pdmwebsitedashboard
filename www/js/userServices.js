angular.module('starter.userServices', [])

.factory('UserAPI', function($rootScope, $http, $ionicLoading, $window){
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

  //this is a rootscope call so that users charity can be called throughout the app
  $rootScope.setCharity = function(charity){
    return $window.localStorage = charity;
  };

  $rootScope.getCharity = function(){
    return $window.localStorage.charity;
  };

  $rootScope.setEmail = function(email){
    return  $window.localStorage.email = email;
  };

  $rootScope.getEmail = function(){
    return $window.localStorage.email;
  };
	return {
		//actual account related activities should be handled by auth

		getOne: function(email){
		  return $http.get(base+'user/find', {
		    method: 'GET',
        params: {
          params: email
        }
      });
    }




	}
})
