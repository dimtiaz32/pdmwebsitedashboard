/**
 * Created by dev on 6/30/16.
 */


angular.module('starter.donationServices', ['ionic'])
.factory('DonationAPI', function($rootScope, $http, $ionicLoading, $window){
  var base = "https://dreamrun.herokuapp.com/";

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
      return $http.get(base + 'donations/sponsors', {
        method: 'GET',
        params: {
          userId:userId
        }
      });
    },

    getAllPledges: function(donorId){
      return $http.get(base + 'donations/pledges',{
        method:'GET',
        params: {
          donorId: donorId
        }
      });
    },

    inviteSponsor: function(form) {
      return $http.post(base + 'donations/sponsors',form,{
        method:'POST',
      });
    },

    completeSponsor: function(form) {
      return $http.post(base + 'donations/myDonations',form,{
        method:'POST',
      });
    },

    getUserByRequestId: function(requestId) {
      return $http.get(base + 'donations/requests',{
        method:'GET',
        params: {
          requestId: requestId
        }
      });
    }
  }
});
