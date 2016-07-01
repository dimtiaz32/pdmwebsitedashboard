/**
 * Created by dev on 6/28/16.
 */


angular.module('starter.charityServices', ['ionic'])
.factory('CharityAPI', function($rootScope, $http, $ionicLoading, $window){
  var base = "https://dreamrun.herokuapp.com";

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

    $rootScope.charities = [
      {
        name: "Teens Run DC",
        description: "This charity does a whole bunch of stuff for teens. Support it.",
        moneyPastWeek: "$1.54",
        moneyPastYear: "$234.56"
      },
      {
        name: "Charity 2",
        description: "This charity does a whole bunch of stuff for teens. Support it.",
        moneyPastWeek: "$1.54",
        moneyPastYear: "$234.56"
      },
      {
        name: "Charity 3",
        description: "This charity does a whole bunch of stuff for teens. Support it.",
        moneyPastWeek: "$1.54",
        moneyPastYear: "$234.56"
      }
    ];


  //TODO: NEED TO VERIFY TOKEN METHODOLOGY
  return{
    getAll: function(token){
      return $http.get(base+'/charities', {
        method: 'GET',
        params: {
          token: token
        }
      });
    },
    getOne: function(token){
      return $http.get(base+'/charities/' + id, {
        method: 'GET',
        params: {
          token: token
        }
      });
    },

    putItem: function(token, form, id){
      return $http.get(base+'/charities/' + id, form, {
        method: 'PUT',
        params: {
          token: token
        }
      });
    },
    saveCharity: function(form){
      return $http.post(base+'/charities', form, {
        method: 'POST'
      });
    }
  }


});
