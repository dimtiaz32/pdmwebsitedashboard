/**
 * Created by dev on 6/30/16.
 */


angular.module('starter.donationServices', ['ionic'])
.factory('DonationAPI', function($rootScope, $http, $ionicLoading, $window){
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

  $rootScope.setToken = function(token){
    return $window.localStorage.token = token;
  };

  $rootScope.getToken = function(token){
    return $window.localStorage.token;
  };

  return{
    getAllSponsors: function(token,userId){
      return $http.get(base + 'donations/sponsors', {
        method: 'GET',
        params: {
          token: token,
          userId:userId
        }
      });
    },

    getAllPledges: function(token,donorId){
      return $http.get(base + 'donations/pledges',{
        method:'GET',
        params: {
          token: token,
          donorId: donorId
        }
      });
    },

    inviteSponsor: function(token,form) {
      return $http.post(base + 'donations/sponsors',form,{
        method:'POST',
        params: {
          token: token
        }
      });
    },

    completeSponsor: function(token,form) {
      return $http.post(base + 'donations/myDonations',form,{
        method:'POST',
        params: {
          token: token
        }
      })
    }
  }
});
