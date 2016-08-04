/**
 * Created by dev on 6/30/16.
 */


angular.module('starter.donationServices', ['ionic'])
.factory('DonationAPI', function($rootScope, $http, $ionicLoading, $window, SERVER_HOST){

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

  return{
    getAllSponsors: function(userId){
      return $http.get(SERVER_HOST + 'donations/sponsors', {
        method: 'GET',
        params: {
          userId:userId
        }
      });
    },

    getAllPledges: function(donorId){
      return $http.get(SERVER_HOST + 'donations/pledges',{
        method:'GET',
        params: {
          donorId: donorId
        }
      });
    },

    inviteSponsor: function(form) {
      return $http.post(SERVER_HOST + 'donations/sponsors',form,{
        method:'POST',
      });
    },

    completeSponsor: function(form) {
      return $http.post(SERVER_HOST + 'donations/myDonations',form,{
        method:'POST',
      });
    },

    getUserByRequestId: function(requestId) {
      return $http.get(SERVER_HOST + 'donations/requests',{
        method:'GET',
        params: {
          requestId: requestId
        }
      });
    }
  }
});
