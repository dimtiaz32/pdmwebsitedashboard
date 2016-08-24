/**
 * Created by dev on 6/28/16.
 */


angular.module('starter.charityServices', ['ionic'])
.factory('CharityAPI', function($rootScope, $http, $ionicLoading, $window, SERVER_HOST){
  var base= "http://localhost:5000/";
  //everything up until return should be put in a main API
  $rootScope.show = function(text){
    $rootScope.loading = $ionicLoading.show({
      template:'<ion-spinner icon="ripple" class="spinner"></ion-spinner>',
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

  $rootScope.setSelectedCharityName = function(charityName){
    return $window.localStorage.charityName = charityName;
  };
  $rootScope.getSelectedCharityName = function(){
    return $window.localStorage.charityName;
  };
  $rootScope.removeSelectedCharityName = function(){
    return $window.localStorage.charityName = "";
  };
  $rootScope.setSelectedCharityMoneyRaised = function(moneyRaised){
    $window.localStorage.totalCharityMoneyRaised= moneyRaised;
  };
  $rootScope.getSelectedCharityMoneyRaised = function(){
    return $window.localStorage.totalCharityMoneyRaised;
  };
  //
  //
  $rootScope.setSelectedCharityDescription = function(charityDescription){
    $window.localStorage.charityDescription = charityDescription;
  };
  $rootScope.getSelectedCharityDescription = function(){
    return $window.localStorage.charityDescription;
  };
  $rootScope.setSelectedCharityUrl = function(charityUrl){
    return $window.localStorage.charityUrl = charityUrl;
  };
  $rootScope.getSelectedCharityUrl = function(){
    return $window.localStorage.charityUrl;
  };
  //
  // $rootScope.setSelectedCharityAvatar = function(charityAvatar){
  //   return $window.localStorage.charityAvatar = charityAvatar;
  // };
  // $rootScope.getSelectedCharityAvatar = function(){
  //   return $window.localStorage.charityAvatar;
  // };
  //
  $rootScope.setMoneyRaisedPerMile = function(moneyPerMile){
    return $window.localStorage.moneyPerMile = moneyPerMile;
  };

  $rootScope.getMoneyRaisedPerMile = function(){
    return $window.localStorage.moneyPerMile;
  };

  $rootScope.setSelectedCharityId = function(charityId){
    return $window.localStorage.charityId = charityId;
  };

  $rootScope.getSelectedCharityId = function(){
    return $window.localStorage.charityId;
  };



  // $rootScope.setCharityMoneyRaised = function(moneyRaised){
  //   $rootScope.selectedCharityMoneyRaised = moneyRaised;
  // };

  // $rootScope.setSelectedCharityName = function(charityName){
  //   $rootScope.selectedCharityName = charityName;
  // };


  // $rootScope.setSelectedCharityDescription = function(charityDescription){
  //   $rootScope.selectedCharityDescription = charityDescription;
  // };
  // $rootScope.setSelectedCharityUrl = function(charityUrl){
  //   $rootScope.selectedCharityUrl = charityUrl;
  // };
  $rootScope.setSelectedCharityAvatar = function(charityAvatar){
    $rootScope.selectedCharityAvatar = charityAvatar;
  };


  return{
    getAll: function(){
      return $http.get(SERVER_HOST+'charities', {
        method: 'GET'

      });
    },
    getById: function(charityId){
      return $http.get(SERVER_HOST+'charity/id', {
        method: 'GET',
        params: {
          charityId: charityId
        }
      });
    },
    getCharityByName: function(name){
      return $http.get(SERVER_HOST+'charity/',  {
        method: 'GET',
        params: {
          name: name
        }
      });
    },

    // selectCharity: function(id, charityName){
    //   return $http.put(SERVER_HOST+'user/selectedCharity', charityName, {
    //     method: 'PUT',
    //     params: {
    //       id: id
    //     }
    //   });
    //
    // },
    // getSelectedCharity: function(token, email){
    //   return $http.get(SERVER_HOST+'user/selectedCharity', email, {
    //     method: 'GET',
    //     params: {
    //      token: token
    //     }
    //   });
    // },

    // putItem: function(token, form, id){
    //   return $http.put(base+'charities/' + id, form, {
    //     method: 'PUT',
    //     params: {
    //       token: token
    //     }
    //   });
    // },
    saveCharity: function(form){
      return $http.post(SERVER_HOST+'charities', form, {
        method: 'POST'
      });
    }
  }


});
