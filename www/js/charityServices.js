/**
 * Created by dev on 6/28/16.
 */


angular.module('starter.charityServices', ['ionic'])
.factory('CharityAPI', function($rootScope, $http, $ionicLoading, $window){
  var base = "http://localhost:5000/";

  //everything up until return should be put in a main API
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

  // $rootScope.doRefresh = function(menu){
  //   if(menu == 1){
  //
  //   }
  // }
  $rootScope.setToken = function(token){
    return $window.localStorage.token = token;
  };

  $rootScope.getToken = function(){
    return $window.localStorage.token;
  };

  $rootScope.setSelectedCharity = function(charity){
    return $window.localStorage.charity = charity;
  };

  $rootScope.getSelectedCharity = function(){
    return $window.localStorage.charity;
  };





  //TODO: NEED TO VERIFY TOKEN METHODOLOGY
  return{
    getAll: function(){
      return $http.get(base+'charities', {
        method: 'GET'

      });
    },
    getOne: function(id){
      return $http.get(base+'charities/' + id, {
        method: 'GET',
        params: {
          token: token
        }
      });
    },
    selectCharity: function(id, charityName){
      return $http.put(base+'user/selectedCharity', charityName, {
        method: 'PUT',
        params: {
          id: id
        }
      });

    },
    getSelectedCharity: function(token, email){
      return $http.get(base+'user/selectedCharity', email, {
        method: 'GET',
        params: {
         token: token
        }
      });
    },

    putItem: function(token, form, id){
      return $http.put(base+'charities/' + id, form, {
        method: 'PUT',
        params: {
          token: token
        }
      });
    },
    saveCharity: function(form){
      return $http.post(base+'charities', form, {
        method: 'POST'
      });
    }
  }


});
