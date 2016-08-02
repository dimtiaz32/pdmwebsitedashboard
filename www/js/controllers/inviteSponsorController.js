/**
 * Created by dev on 8/2/16.
 */

angular.module('starter.inviteSponsorController', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',

  'starter.historyServices',

  'starter.runServices',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar'])



  .controller('InviteSponsorStartCtrl', function($scope, $location, store, DonationAPI) {
    store.set("requestId", $location.search().id);

    DonationAPI.getUserByRequestId($location.search().id).success(function (data) {
      if (data.name) {
        store.set("recipient.name", data.name.first + " " + data.name.last);
      } else if (data.facebook) {
        store.set("recipient.name", data.facebook.firstname + " " + data.facebook.lastname);
      } else if (data.google) {
        store.set("recipient.name", data.google.firstname + " " + data.google.lastname);
      } else {
        console.log("illegle url!");
        throw new Error("illegle url");
      }

      $scope.name = store.get('recipient.name');

    }).error(function (err) {
      console.log("err:" + err);
      throw err;
    });
  })


  .controller('MyPledgesCtrl',function($rootScope, $scope, $filter, $window, DonationAPI){

  })

  .controller('InviteSponsorInfoCtrl', function($rootScope, $scope, $http, store, $window){
    $scope.user = {
      firstname: "",
      lastname: ""
    };

    $scope.name = store.get('recipient.name');

    $scope.saveName = function() {

      var firstname = this.user.firstname;
      var lastname = this.user.lastname;

      if(!firstname || !lastname) {
        //$rootScope.notify("Please enter valid data");
        return false;
      }

      store.set('user.firstname',firstname);
      store.set('user.lastname', lastname);
      $window.location.href = ('#/app/inviteSponsor/amount');
    }
  })

  .controller('InviteSponsorAmountCtrl', function($scope, $http, store, $window) {

    $scope.active = 'zero';
    $scope.name = store.get('recipient.name');

    $scope.setActive = function (type) {
      $scope.active = type;
    };
    $scope.isActive = function (type) {
      return type === $scope.active;
    };

    $scope.donor = {
      amount: ""
    };


    $scope.saveMoney = function() {

      var amount = this.donor.amount;

      if(!amount && $scope.active == 'zero') {
        return false;
      }
      if (amount != '') {
        store.set('donor.amount', amount);
      }
      $window.location.href = ('#/app/inviteSponsor/pledge');
    }

    $scope.saveMoneyWithAmount = function(amount) {
      store.set('donor.amount', amount);
    }
  })

  .controller('InviteSponsorPledgeCtrl', function($scope, $http, store, $window){

    $scope.active = 'zero';
    $scope.name = store.get('recipient.name');

    $scope.setActive = function(type) {
      $scope.active = type;
    };
    $scope.isActive = function(type) {
      return type === $scope.active;
    };

    $scope.donor = {
      months: ""
    };

    $scope.saveMonths = function() {

      var months = this.donor.months;

      if (!months && $scope.active == 'zero') {
        return false;
      }
      if (months != '') {
        store.set('donor.months', months);
      }
      $window.location.href = ('#/app/inviteSponsor/payment');
    }

    $scope.saveMonthsWithMonths = function(months) {
      store.set('donor.months',months);
    }

  })

  .controller('InviteSponsorPaymentCtrl', function($rootScope, $scope, $http, store, DonationAPI, $window, AuthAPI){
    $scope.user = {
      email: ""
    };
    $scope.name = store.get('recipient.name');

    $scope.completeSponsor = function(status, response) {

      var email = this.user.email;
      if(!email) {
        return false;
      }

      if (response.error) {
        console.log('token:' + response.error.message);
      } else {
        console.log("amount:" + store.get('donor.amount'));
        DonationAPI.completeSponsor({
          firstName: store.get('user.firstname'),
          lastName: store.get('user.lastname'),
          email: email,
          amount: store.get('donor.amount'),
          months: store.get('donor.months'),
          stripeToken: response.id,
          userId: $rootScope.getUserId(),
          requestId: store.get('requestId')
        }).success(function (data){
          $window.location.href = ('#/app/inviteSponsor/end');
        }).error(function (err,status){
          console.log("error: " + err);
          $rootScope.verifyStatus(status);
        });
      }
    }
  })


  // Do the first time when page loaded
  // $scope.doRefresh();

  .controller('InviteSponsorEndCtrl', function($scope, $http, store){
    $scope.months = store.get('donor.months');
    $scope.amount = store.get('donor.amount');
    $scope.name = store.get('recipient.name');
  })
