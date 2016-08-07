angular.module('starter.userServices', [])

.factory('UserAPI', function($rootScope, $http, $ionicLoading, $window){
	// var base = "https://dreamrun.herokuapp.com/";
  var base="http://localhost:5000/";
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
		  return $http.get(base + 'user/find', {
		    method: 'GET',
        params: {
          params: email
        }
      });
    },
    getGoals: function(userId){
      return $http.get(base+'user/goals', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    updateDailyGoals: function(userId, form){
      return $http.post(base+'user/dailyGoals', form, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },

    updateWeeklyGoals: function(userId, form){
      return $http.post(base+'user/weeklyGoals', form, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },
    updateYearlyGoals: function(userId, form){
      return $http.post(base+'user/yearlyGoals', form, {
        method:'POST',
        params:{
          userId: userId
        }
      });
    },
    getDayProgress: function(userId){
      return $http.get(base+'history/dayProgress',{
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getWeekProgress: function(userId){
      return $http.get(base+'history/weekProgress', {
        method: 'GET',
        params: {
          userId:userId
        }
      });
    },
    getYearProgress: function(userId){
      return $http.get(base+'history/yearProgress', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    getSelectedCharity: function(userId){
      return $http.get(base+'user/selectedCharity', {
        method: 'GET',
        params: {
          userId: userId
        }
      });
    },
    setSelectedCharity : function(userId, form){
      return $http.post(base+'user/selectedCharity', form ,{
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },
    getPastCharities: function(userId){
      return $http.get(base+'user/pastCharities', {
        method:'GET',
        params: {
          userId: userId
        }
      });
    },
    updatePastCharities: function(userId, form){
      return $http.post(base+'user/pastCharities', form, {
        method: 'POST',
        params: {
          userId: userId
        }
      });
    },
    getTopThreeCharities: function(userId){
      return $http.get(base+'user/topThreeCharities')
    }
	}
});
