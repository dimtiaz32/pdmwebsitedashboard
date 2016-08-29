/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.authController', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',
  'starter.historyServices',
  'starter.runServices',
  'starter.directives',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar'])


  .controller('SignUpCtrl', function($scope, $rootScope, $ionicModal, $timeout, AuthAPI, RunAPI, $window, UserAPI){

    //Keyboard stuff
    $scope.keyPressed = function(event) {
      if (event.which === 13) {
        cordova.plugins.Keyboard.close();
      }
    };
    //End keyboard stuff

    $scope.user = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      charity: "",
      history: [],
      provider: "",
      past_donations_from: [],
      past_donations_to: [],
      donations_to: [],
      donations_from: [],
      past_charities: [],
      created: Date,
      updated: Date
    }

    $scope.secondPassword = {
      password:""
    };

    $scope.errorMessage = "";
    $scope.invalidFirstName = false;
    $scope.invalidLastName = false;
    $scope.invalidEmail = false;
    $scope.invalidPassword = false;


    $scope.verifyPassword = function(){
      var password = this.user.password;
      var passwordCheck = this.secondPassword.password;
      var match;

      if (password === passwordCheck){
        $rootScope.notify("Passwords Match!");
        console.log("Passwords match!");
        match = true;
        $scope.invalidPassword = false;
      } else {
        $rootScope.notify("Passwords do not match. Please reenter your password");
        console.log("Error: Passwords do not match");
        match = false;
        $scope.errorMessage="Passwords do not match";
        $scope.invalidPassword = true;
      }

      $rootScope.show("Passwords match....");

    };
    $scope.createUser = function(){
      $rootScope.show("Signing up...");

      var firstName = this.user.firstName.trim();
      var lastName = this.user.lastName.trim();
      var email  =  this.user.email.trim().toLowerCase();
      var password = this.user.password.trim();

      if(!firstName){
        $rootScope.notify("Please enter a valid first name");
        console.log("createUser failed: invalid first name");
        $scope.invalidFirstName = true;
        $scope.errorMessage = "Please fill all fields";
        $rootScope.hide();
        return false;
      } else if(!lastName){
        $rootScope.notify("Please enter a valid last name");
        console.log("createUser failed: invalid last name")
        $scope.invalidLastName = true;
        $scope.errorMessage = "Please fill all fields";
        $rootScope.hide();
        return false;
      } else if(!email){
        $rootScope.notify("Please enter a valid email address");
        console.log("createUser failed: invalid email");
        console.log(email.trim());
        $scope.invalidEmail = true;
        $scope.errorMessage = "Please fill all fields";
        $rootScope.hide();
        return false;
      } else if(!password){
        $rootScope.notify("Please enter a valid password");
        console.log("createUser failed: invalid password");
        $scope.invalidPassword = true;
        $scope.errorMessage = "Please fill all fields";
        $rootScope.hide();
        return false;
      }

      $rootScope.notify("Register your account:)");
      AuthAPI.signup({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        provider: 'local'
      }).success(function (data, status, headers, config){
        $rootScope.hide();
        //$rootScope.setCharity(charity);
        $rootScope.setEmail(email);
        console.log("data:" + JSON.stringify(data));
        var name =data.user.name.first + data.user.name.last;
        console.log('name: ' + name);

        $rootScope.setName(name);
        $rootScope.setToken(data.token);
        $rootScope.setUserId(data.user._id);
        console.log("password: " + data.user.password);
        $rootScope.setPassword(data.user.password);
        $rootScope.loadMap();
        $rootScope.hide();
        $window.location.href  = ('#/app/charities');
      })
        .error(function(error){
          $rootScope.hide();
          // console.log(error.error);
          // console.log(error.error.code);
          if(error.error == "Invalid User"){
            // if(error.error && error.error.code == 11000){
            $rootScope.notify("This email is already in use");
            console.log("could not register user: email already in use ");
            $scope.errorMessage = "This email is already in use";
          } else {
            $rootScope.notify("An error has occured. Please try again");
            $scope.errorMessage = "An error has occured. Please try again";
          }
        });
    }
  })

  .controller("ResetCtrl",function($scope,$rootScope,$location, UserAPI, $window){

      $scope.email = $location.search().email.trim().toLowerCase();
      $scope.token = $location.search().token;
      $scope.data = {
        newPassword: "",
        confirmPassword: ""
      }

      $scope.changePassword = function() {

        if(!$scope.data.newPassword){
          $rootScope.notify("Change failed. Please enter a valid new Password");
          console.log("Invalid new password");
          return false;
        } else if($scope.data.newPassword != $scope.data.confirmPassword){
          $rootScope.notify("Change failed. Please match the password ");
          console.log("Invalid match password");
          return false;
        }

        console.log("email:" + $scope.email);
        console.log("newPassword:" + $scope.data.newPassword);
        $rootScope.setToken = $scope.token;
        UserAPI.changePassword({email:$scope.email,newPassword:$scope.data.newPassword}).success(function(data){
          console.log("change password success!");
          $window.location.href = "#/auth/signin";
        }).error(function(error){
          console.log("change password failed!" + error);
          $rootScope.notify("change password failed!");
        })

      }
  })

  .controller('SigninCtrl', function($scope, $rootScope, $timeout, AuthAPI, $ionicPopup, $window, ngFB, GooglePlus, CharityAPI,HistoryAPI, UserAPI, RunAPI){

    $scope.user = {
      email: "",
      id: "",
      name: "",
      password: "",
      charity: "",
      history: [],
      provider: "",
      donorId:"",
      past_donations_from: [],
      past_donations_to: [],
      donations_to: [],
      donations_from: [],
      past_charities: [],
      created: Date,
      updated: Date

    };


    $scope.setUserCharity  = function(charityId){
      console.log('setUserCharityCalled with ID: ' + charityId);
      CharityAPI.getById(charityId)
        .success(function(data, status, headers, config){
          console.log('setUserCharity CharityAPI getById successfully called');
          $rootScope.setSelectedCharityName(data.name);
          $rootScope.setSelectedCharityDescription(data.description);
          $rootScope.setSelectedCharityUrl(data.url);
          console.log('$rootScope.selectedCharityName : ' + $rootScope.getSelectedCharityName());
          console.log(' $rootScope.selectedCharityDescription: ' + $rootScope.getSelectedCharityDescription());
          console.log(' $rootScope.selectedCharityUrl : ' + $rootScope.getSelectedCharityUrl());
        })
        .error(function(err, status){
          console.log('Charity API getCharityById call failed with error: ' + err + ' and status: ' + status);
        });
    }


    $scope.errorMessage = "";



    $scope.login = function(){
      $rootScope.show("Signing in...");
      var email = this.user.email.trim().toLowerCase();
      var password = this.user.password.trim();

      if(!email){
        $rootScope.notify("Login failed. Please enter a valid email address");
        console.log("Invalid text in email field");
        $scope.errorMessage = "Please enter valid email";
        $rootScope.hide();
        return false;
      } else if(!password){
        $rootScope.notify("Login failed. Please enter a valid password");
        console.log("Invalid text in password field");
        $scope.errorMessage = "Please enter valid email & password";
        $rootScope.hide();
        return false;
      }

      AuthAPI.signin({
        email: email,
        password: password
      })
        .success(function(data, status, headers, config){
          var firstName = data.user.name.first.trim();
          var lastName = data.user.name.last.trim();

          $scope.user.name = firstName + ' ' + lastName;
          console.log('$scope.name set as: ' + $scope.user.name);
          $rootScope.setName($scope.user.name);
          console.log('user name localStorage set to: ' + $rootScope.getName());

          $scope.user.email = data.user.email.trim();
          console.log('$scope.user.email set to: ' + $scope.user.email);
          $rootScope.setEmail($scope.user.email);
          console.log('Email set as: ' + $rootScope.getEmail());

          $scope.user.created = data.user.created;
          console.log('$scope.user.created set as: ' + $scope.user.created);
          $rootScope.setCreatedAt($scope.user.created);
          console.log('createdAt local storage set: ' + $rootScope.getCreatedAt());

          $scope.user.id = data.user._id;
          console.log('$scope.user.id set to: ' + $scope.user.id);
          $rootScope.setUserId($scope.user.id);
          console.log('User id local storage set: ' + $rootScope.getUserId());
          $rootScope.setToken(data.token);
          console.log("token: " + data.token);
          $rootScope.setAvatar(data.user.avatar);
          console.log("password: " + data.user.password);
          $rootScope.setPassword(data.user.password);

          $scope.user.donorId = data.user.donorId;
          console.log('donorId: ' + $scope.user.donorId);

          // console.log(data.user.charityName);
          if(data.user.charity == null || data.user.charity.id == null){
            console.log('user.charityId is null');
            $scope.noCharity = true;
          } else {
            console.log('data.user.charity.id: ' + data.user.charity.id);
            console.log('data.user.charity');
            $rootScope.setSelectedCharityId(data.user.charity.id);
            $rootScope.setSelectedCharityMoneyRaised(data.user.charity.moneyRaised);
            $rootScope.setSelectedCharityName(data.user.charityName);
            console.log('selectedCharityId: ' +  $rootScope.getSelectedCharityId());
            console.log('selectedCharityMoneyRaised: ' + $rootScope.getSelectedCharityMoneyRaised());
            $scope.setUserCharity($rootScope.getSelectedCharityId());
          }


          // $scope.user.charityName = data.charityName;
          // console.log('Charity: ' + $scope.user.charity);
          // $scope.setUserCharity($scope.user.charityName);

          // $scope.user.charityId = data.charityId;
          // console.log('$scope.user.charityId set as: ' + $scope.user.charityId);
          // $rootScope.setSelectedCharity($scope.user.charityId);
          // console.log('selectedCharity local storage set: ' + $rootScope.getSelectedCharity());

          // $rootScope.$broadcast("initial");
          // $rootScope.$broadcast('newMap');


          $rootScope.getSponsors();

          //Set these inputs to be empty
          $scope.user.email = '';
          $scope.user.password = '';


          $rootScope.$broadcast('LoadRun');
          $rootScope.$broadcast('ChangeCharity');
          $rootScope.$broadcast('fetchMySponsors');
          $rootScope.$broadcast('initial');
          $rootScope.$broadcast('runMonthMoneyRaised');
          $rootScope.$broadcast('runWeekMoneyRaised');
          $rootScope.$broadcast('newMap');
          $rootScope.$broadcast('initRun');
          $rootScope.hide();
          $window.location.href=('#/app/run');

        })
        .error(function(error, status){
          $rootScope.hide();
          if (status == 400) {
            console.log(status);
            console.log(error);
            $scope.user.email = "";
            $scope.user.password = "";
            $scope.errorMessage = "Invalid username/password";
          }
        });
    };

    $scope.signinByFB = function() {
      console.log("begin login by FB");
      ngFB.login({scope:'email'}).then(function (response){
        if (response.status == 'connected') {
          AuthAPI.signinByFB({
            access_token: response.authResponse.accessToken
          }).success(function(data, status, headers, config){
            $rootScope.hide();
            $rootScope.setUserId(data.user._id);
            console.log('User id: ' + $rootScope.getUserId());
            $rootScope.setToken(data.token);
            $rootScope.setName(data.user.facebook.firstname + ' ' + data.user.facebook.lastname);
            console.log("facebook name: " + $rootScope.getName());
            $rootScope.setAvatar(data.user.facebook.avatar);
            console.log("facebook avatar: " + $rootScope.getAvatar());
            if(data.user.charity == null || data.user.charity.id == null){
              console.log('user.charityId is null');
              $scope.noCharity = true;
            } else {
              console.log('data.user.charity.id: ' + data.user.charity.id);
              $rootScope.setSelectedCharityId(data.user.charity.id);
              $rootScope.setSelectedCharityMoneyRaised(data.user.charity.moneyRaised);
              console.log('selectedCharityId: ' +  $rootScope.getSelectedCharityId());
              console.log('selectedCharityMoneyRaised: ' + $rootScope.getSelectedCharityMoneyRaised());
              $scope.setUserCharity($rootScope.getSelectedCharityId());
            }



            $rootScope.getSponsors();

            $rootScope.$broadcast("fetchMySponsors");
            $rootScope.$broadcast('LoadRun');
            $rootScope.$broadcast('initial');
            $rootScope.$broadcast('runMonthMoneyRaised');
            $rootScope.$broadcast('newMap');
            $rootScope.$broadcast('fetchCharities');
            $rootScope.$broadcast('initRun');
            $rootScope.hide();
            $window.location.href=('#/app/run');
          }).error(function(error){
            console.log("AuthAPI.signinByFB failed:" + error);
            $rootScope.hide();
            $rootScope.notify("Login with facebook failed")
          });
        } else if (response.status == 'not_authorized') {
          console.log('facebook login not authorized')
        } else {
          console.log('facebook login failed');
        }
      });
      console.log("end login by FB");
    };

    $scope.signinByGoogle = function() {

      console.log("begin login by google");

      GooglePlus.login({scope:"https://www.googleapis.com/auth/userinfo.email"}).then(function (authResult) {
        console.log("google login success");
        AuthAPI.signinByGG({
          access_token: authResult.access_token
        }).success(function(data, status, headers, config){
          $rootScope.hide();
          $rootScope.setUserId(data.user._id);
          $rootScope.setEmail(data.user.email);
          console.log('User email: ' + $rootScope.getEmail());
          console.log('User id: ' + $rootScope.getUserId());
          $rootScope.setToken(data.token);
          $rootScope.setName(data.user.google.firstname + ' ' + data.user.google.lastname);
          $rootScope.setAvatar(data.user.google.avatar);
          $rootScope.$broadcast("initial");
          $rootScope.loadMap();
          $window.location.href=('#/app/charities');
        }).error(function(error){
          console.log("AuthAPI.signinByFB failed:" + error);
          $rootScope.hide();
          $rootScope.notify("Login with facebook failed")
        });
      }, function (err) {
        console.log("google login failed");
        console.log(err);
      });

      console.log("end login by google");
    }


    $scope.showForgotPassword = function(){
      console.log('popup')
      $scope.data = {}
      var forgotPassword = $ionicPopup.show({
        template: '<input type="text" ng-model="data.email">',
        title: 'Enter email for password reset',
        //subTitle: 'Whatever you want',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Submit</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.email) {
                e.preventDefault();
              } else {
                console.log("email:" + JSON.stringify($scope.data.email));
                e.preventDefault();
                UserAPI.isSignup($scope.data.email.trim().toLowerCase()).success(function(data){
                   console.log("check is existed:" +  JSON.stringify(data));
                   if(data.isExisted) {
                     console.log("success,email is existed");
                     $rootScope.setToken(data.token);
                     $ionicPopup._popupStack[0].responseDeferred.resolve();
                     UserAPI.sendMail({email:$scope.data.email.trim().toLowerCase()}).success(function(data){
                        console.log("send mail success");
                     }).error(function(data){
                        console.log("send mail failed");
                     })
                   } else {
                     console.log("email is not existed, please sign up first");
                     $rootScope.notify("email is not existed, please sign up first");
                   }
                }).error(function(error){
                    console.log("check email failed:" + error);
                    e.preventDefault();
                });
              }
            }
          }
        ]
      })
    }

  })

// .controller('SignOutCtrl', function($scope, $rootScope, $localStorage, $timeout, AuthAPI, $window){
//   $scope.logout = function(){
//     $rootScope.notify("Logging the user out");
//     console.log("Logout function activated");
//     $rootScope.removeToken();
//     AuthAPI.signout({token: token})
//       .sucess(function(){
//         $rootScope.hide();
//         $scope.removeProfile();

//         $window.location.href = ('#/auth/signin');
//         console.log("Signout successful")
//       })
//       .error(function(error){
//           $rootScope.notify("Error logging out: " + error.error);
//           console.log("Error loggin out: " + error.error);
//       });
//   }


// })
