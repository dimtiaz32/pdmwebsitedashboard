angular.module('starter.userServices', [])

.factory('UserAPI', function($rootScope, $http, $ionicLoading, $window, SERVER_HOST, CLIENT_HOST){
	// var base = "https://dreamrun.herokuapp.com/";
  // var base="http://localhost:5000/";
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
		  return $http.get(SERVER_HOST + 'user/find', {
		    method: 'GET',
        params: {
          email: email
        }
      });
    },

    isSignup: function(email) {
      return $http.get(SERVER_HOST + 'user/email',{
        method: 'GET',
        params: {
          email:email
        }
      })
    },

    sendMail: function(form) {
      return $http.post(SERVER_HOST + 'user/email',form,{
        method: 'POST'
      })
    },

    changePassword: function(form) {
      return $http.post(SERVER_HOST + 'user/password',form, {
          method: 'POST'
      })
    },

    getGoals: function(userId){
      return $http.get(SERVER_HOST+'user/goals', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    updateDailyGoals: function(userId, form){
      return $http.post(SERVER_HOST+'user/dailyGoals', form, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },

    updateWeeklyGoals: function(userId, form){
      return $http.post(SERVER_HOST+'user/weeklyGoals', form, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },
    updateYearlyGoals: function(userId, form){
      return $http.post(SERVER_HOST+'user/yearlyGoals', form, {
        method:'POST',
        params:{
          userId: userId
        }
      });
    },
    getDayProgress: function(userId){
      return $http.get(SERVER_HOST+'history/dayProgress',{
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getWeekProgress: function(userId){
      return $http.get(SERVER_HOST+'history/weekProgress', {
        method: 'GET',
        params: {
          userId:userId
        }
      });
    },
    getYearProgress: function(userId){
      return $http.get(SERVER_HOST+'history/yearProgress', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getSelectedCharity: function(userId){
      return $http.get(SERVER_HOST+'user/selectedCharity', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    setSelectedCharity : function(userId, form){
      return $http.post(SERVER_HOST+'user/selectedCharity', form ,{
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },
    getPastCharities: function(userId){
      return $http.get(SERVER_HOST+'user/pastCharities', {
        method:'GET',
        params: {
          userId: userId
        }
      });
    },
    updatePastCharities: function(form){
      return $http.post(SERVER_HOST+'user/pastCharities', form, {
        method: 'POST',

      });
    },
    getTopThreeCharities: function(userId){
      return $http.get(SERVER_HOST+'user/topThreeCharities', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    updateCharityName: function(userId, charityName){
      return $http.post(SERVER_HOST+'user/updateCharityName', charityName, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    }
	}
});
