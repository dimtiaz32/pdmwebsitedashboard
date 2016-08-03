/**
 * Created by dev on 8/2/16.
 */


angular.module('starter.accountController', ['starter.appServices',
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




  .controller('AccountCtrl', function($rootScope, AuthAPI, UserAPI, $window, $scope, $ionicPopup) {

    $rootScope.$on('initial', function(){
      console.log("---------start account ctrl initial---------");

      $scope.user = {
        email: "",
        name: "",
        password: "",
        charity: {},
        history: [],
        provider: "",
        past_donations_from: [],
        past_donations_to: [],
        donations_to: [],
        donations_from: [],
        past_charities: [],
        created: Date,
        updated: Date

      };

      $scope.user.name = $rootScope.getName();
      console.log('user name set as: ' + $scope.user.name);
      $scope.user.email = $rootScope.getEmail();
      console.log('user email set as: '+ $scope.user.email);
      $scope.user.password = $rootScope.getPassword();
      console.log('user password set as: ' + $scope.user.password);


      console.log("--------end account ctrl initial---------");
    });

    $rootScope.$on('destroy', function(){
      console.log("---------start account ctrl destroy---------");
      $scope.user = undefined;
      console.log("---------end account ctrl destroy---------");
    });

    // do the initial at first time when the controller load, only just once~
    $rootScope.$broadcast('initial');

    $scope.updateAccount = function () {
      var name = this.account.firstName + ' ' + this.account.lastName;
      var proPic = this.account.profilePicture;
      var email = this.account.email;
      var password = this.account.password;
      var dob = this.account.dob;
      var created = this.account.created;
      var updated = this.account.updated;


      //only checking for fields that can be changed
      //profile picture can be deleted since it is not necessary


      if (!email) {
        $rootScope.show('Email field cannot be empty');
        console.log('Email field was empty');
      } else if (!password) {
        $rootScope.show('Password field cannot be empty');
        console.log('Password field was empty');
      }

      console.log('Email and password fields verified, attempting to save account changes...');
      $rootScope.notify('Saving changes to your account');
      AccountAPI.saveAccount({
        email: email,
        password: password
      }).success(function (data, headers, config, status) {

        $rootScope.hide();
        $window.location.href = ('#/app/account');
      })

        .error(function (error,status) {
          if (error.error && error.error.code == 11000) {
            $rootScope.notify("This email is already in use");
            console.log("could not register user: email already in use ");
          } else {
            $rootScope.notify("An error has occured. Please try again");
          }
          $rootScope.verifyStatus(status);
        });
    }


    //CHANGE PASSWORD
    $scope.popup = {
      currentPasswordHolder: "",
      password1: "",
      password2: ""
    }

    $scope.showAlert = function(title, text){
      var alertMessage = $ionicPopup.show({
        title: title,
        template: '<p style="text-align: center;">'+text+'</p>',
        buttons: [{
          text: '<b>Close</b>',
          type: 'button-positive',
        }]
      })
    };


    //TODO: FIX PASSWORD RETURN – CURRENTLY RETURNS 'UNDEFINED'
    //TODO: GET PASSWORD TO UPDATE ON SERVER
    $scope.showConfirmPassword = function(){
      var confirmPassword = $ionicPopup.show({
        template: '<input type="password" ng-model="popup.currentPasswordHolder">',
        title: 'Change password',
        subTitle: 'Enter current password',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Next',
            type: 'button-positive',
            onTap: function(e) {
              var currentPassword = $rootScope.getPassword();
              console.log('Current Password: '+ currentPassword);
              console.log($rootScope.getPassword());
              if (currentPassword != $scope.popup.currentPasswordHolder) {
                $scope.showAlert('Oops!', "You didn't enter your current password");
                $scope.popup.currentPasswordHolder = "";
                e.preventDefault();
              } else if (currentPassword == $scope.popup.currentPasswordHolder) {
                $scope.popup.currentPasswordHolder = "";
                $scope.showChangePassword();
              }
            }
          }
        ]
      })
    };

    $scope.showChangePassword = function(){
      var changePassword = $ionicPopup.show({
        template: '<input type="password" ng-model="popup.password1" placeholder="New password">' +
        '<div style="padding: 5px 0;"></div>' +
        '<input type="password" ng-model="popup.password2" placeholder="Confirm new password">',
        title: 'Change password',
        // subTitle: 'subtitle',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Change</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($scope.popup.password1 == $scope.popup.password2) {
                var newPassword = $scope.popup.password1;
                $scope.popup.password1 = "";
                $scope.popup.password2 = "";
                $scope.showAlert('Yay!','Password changed');
                $rootScope.setPassword(newPassword);
                console.log($rootScope.getPassword())
              } else if ($scope.popup.password1 == "") {
                $scope.showAlert('Oops!',"Don't leave any field blank!");
                e.preventDefault();
              } else if ($scope.popup.password1 == "") {
                $scope.showAlert('Oops!',"Don't leave any field blank!");
                e.preventDefault();
              } else if ($scope.popup.password1 != $scope.popup.password2) {
                $scope.popup.password1="";
                $scope.popup.password2="";
                $scope.showAlert('Oops!','Passwords do not match');
                e.preventDefault();
              } else {
                $scope.popup.password1="";
                $scope.popup.password2="";
                $scope.showAlert('Oops!',"You didn't enter passwords correctly");
                e.preventDefault();
              }
            }
          }
        ]
      })
    }


    //SAVE CHANGES
    $scope.saveIsHidden = true;

    $scope.formChanged = function() {
      console.log("form is changed");

      $scope.editing = 'editing'
      $scope.saveIsHidden = false;
    }

    $scope.save = function() {
      console.log($scope.user.email)

      //TODO: check to see if it a valid email
      $rootScope.setEmail($scope.user.email)

      //make text gray and hide save button
      $scope.editing = '';
      $scope.saveIsHidden = true;
      //TODO:NEED TO REFRESH SERVER WITH UPDATE
    }

    //Resetting changes if leave page before saving
    $scope.$on("$ionicView.leave", function(){
      console.log('leaving view');
      console.log($scope.user.email);
      console.log($rootScope.getEmail());
      $scope.user.email = $rootScope.getEmail();

      //make text gray and hide save button
      $scope.editing = '';
      $scope.saveIsHidden = true;
    })

  })
