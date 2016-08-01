angular.module('starter.controllers', ['starter.appServices',
    'starter.charityServices',
    'starter.authServices',
    'starter.runServices',
    'starter.donationServices',
    'starter.userServices',

    'starter.historyServices',

    'starter.runServices','ionic','ngCordova','ngOpenFB', 'chart.js','ngCookies', 'ionic.contrib.drawer.vertical', 'angular-svg-round-progressbar'])


  .controller('SignUpCtrl', function($scope, $rootScope, $ionicModal, $timeout, AuthAPI, $window, UserAPI){
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


    $scope.verifyPassword = function(){
      var password = this.user.password;
      var passwordCheck = this.secondPassword.password;
      var match;

      if (password === passwordCheck){
        $rootScope.notify("Passwords Match!");
        console.log("Passwords match!");
        match = true;
      } else {
        $rootScope.notify("Passwords do not match. Please reenter your password");
        console.log("Error: Passwords do not match");
        match = false;
      }

      $rootScope.show("Passwords match....");


    };
    $scope.createUser = function(){
      var firstName = this.user.firstName;
      var lastName = this.user.lastName;
      var email  =  this.user.email;
      var password = this.user.password;
      var charity = this.user.charity;


      if(!firstName){
        $rootScope.notify("Please enter a valid first name");
        console.log("createUser failed: invalid first name");
      } else if(!lastName){
        $rootScope.notify("Please enter a valid last name");
        console.log("createUser failed: invalid last name")
      } else if(!email){
        $rootScope.notify("Please enter a valid email address");
        console.log("createUser failed: invalid email");
      } else if(!password){
        $rootScope.notify("Please enter a valid password");
        console.log("createUser failed: invalid password");
      }

      $rootScope.notify("Register your account:)");
      AuthAPI.signup({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        charity: charity,
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
          $rootScope.$broadcast("initial");
          $window.location.href  = ('#/app/charities');
        })
        .error(function(error){
          $rootScope.hide();
          if(error.error && error.error.code == 11000){
            $rootScope.notify("This email is already in use");
            console.log("could not register user: email already in use ");
          } else {
            $rootScope.notify("An error has occured. Please try again");
          }
        });
    }
  })
  .controller('SigninCtrl', function($scope, $rootScope, $timeout, AuthAPI, $ionicPopup, $window, ngFB, GooglePlus, CharityAPI){

    $scope.user = {
      email: "",
      id: "",
      name: "",
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

    };

    $scope.setUserCharity  = function(charityName){

      $scope.charityHeader = charityName;
      console.log('$scope.charityHeader: ' + $scope.charityHeader);
      var charityHeaderString =  $scope.charityHeader.toString();
      console.log('Charity Stringified: ' + charityHeaderString);
      CharityAPI.getCharityByName(charityHeaderString)
        .success(function(data, status, headers, config){
          if(data.length == 0){
            $scope.noCharity = true;
          } else {
            var cId = data._id;
            console.log('JSON returned charityId value of: ' + cId);
            var cName = data.name;
            console.log('getCharityByName returned cName value of: ' + cName);
            var cDescription = data.description;
            console.log('getCharityByName returned cDescription value of: ' + cDescription);
            var cUrl = data.url;
            console.log('getCharityByName returned cUrl value of: ' + cUrl);
            var cAvatar = data.avatar;
            console.log('getCharityByName returned cAvatar: ' + cAvatar);
            $rootScope.setSelectedCharityName(cName);
            console.log('$rootScope.getSelectedCharityName(): ' + $rootScope.getSelectedCharityName());
            $rootScope.setSelectedCharityDescription(cDescription);
            console.log('$rootScope.getSelectedCharityDescription(): ' + $rootScope.getSelectedCharityDescription());
            $rootScope.setSelectedCharityUrl(cUrl);
            console.log('$rootScope.getSelectedCharityUrl(): ' + $rootScope.getSelectedCharityUrl());
            $rootScope.setSelectedCharityAvatar(cAvatar);
            console.log('$rootScope.getSelectedCharityAvatar' + $rootScope.getSelectedCharityAvatar());
            $rootScope.setSelectedCharityId(cId);
            console.log('$rootScope.getSelectedCharityId(): ' + $rootScope.getSelectedCharityId());
          }

          $rootScope.$broadcast('fetchMySponsors');

          if($scope.noSponsor = true){
            console.log('fetchMySponsors returned no sponsors');
          }

        })
        .error(function(err,status){
          console.log('CharityAPI.getOne failed with error: ' + err);
          console.log('Could not retrieve charity information');
          $rootScope.verifyStatus(status);
        })

    }


    $scope.login = function(){
      var email = this.user.email;
      var password = this.user.password;

      if(!email){
        $rootScope.notify("Login failed. Please enter a valid email address");
        console.log("Invalid text in email field");
      } else if(!password){
        $rootScope.notify("Login failed. Please enter a valid password");
        console.log("Invalid text in password field");
      }

      AuthAPI.signin({
          email: email,
          password: password
        })
        .success(function(data, status, headers, config){
          var firstName = data.user.name.first;
          var lastName = data.user.name.last;

          $scope.user.name = firstName + ' ' + lastName;
          console.log('$scope.name set as: ' + $scope.user.name);
          $rootScope.setName($scope.user.name);
          console.log('user name localStorage set to: ' + $rootScope.getName());

          $scope.user.password = data.user.password;
          console.log('$scope.user.password set as: ' + $scope.user.password);
          $rootScope.setPassword($scope.user.password);

          $scope.user.email = data.user.email;
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

          // console.log(data.user.charityName);
          if(data.user.charityName == undefined || data.user.charityName == ""){
            $scope.noCharity = true;
          } else {
            $scope.setUserCharity(data.user.charityName);
          }



          // $scope.user.charityName = data.charityName;
          // console.log('Charity: ' + $scope.user.charity);
          // $scope.setUserCharity($scope.user.charityName);

          // $scope.user.charityId = data.charityId;
          // console.log('$scope.user.charityId set as: ' + $scope.user.charityId);
          // $rootScope.setSelectedCharity($scope.user.charityId);
          // console.log('selectedCharity local storage set: ' + $rootScope.getSelectedCharity());

          $rootScope.hide();
          $rootScope.$broadcast("initial");
          $window.location.href=('#/app/run');

        })
        .error(function(error){
          $rootScope.hide();
          $rootScope.notify("Invalid username or password");
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
              $rootScope.$broadcast("initial");
              $window.location.href=('#/app/charities');
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

    $scope.popup = {
      email: ""
    }

    $scope.showForgotPassword = function(){
      var forgotPassword = $ionicPopup.show({
        template: '<input type="email" ng-model="popup.email">',
        title: 'Enter email for password reset',
        //subTitle: 'Whatever you want',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Submit</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.popup.email) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.popup.email;
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

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $interval, RunAPI, CharityAPI, $ionicPopup, AuthAPI, $ionicModal){

    //CONSOLE LOGGING COLORS:

    //UI-INTERACTIONS: TEAL
    //UI-CHANGES: GREEN
    //RUN STATE CHANGE: HOTPINK
    //TIMER:ROYALBLUE
    //DISTANCE: PURPLE
    //POLYLINE: LIME
    //PACE: GOLD
    //LAP: AQUA
    //MONEYRAISED: GREY
    //(L)TIMER: BLUE
    //(L)DISTANCE: MEDIUMPURPLE
    //(L)PACE: DarkGoldenRod

    //UI-INTERACTIONS: TEAL
    //UI-CHANGES: GREEN
    //RUN STATE CHANGE: HOTPINK
    //TIMER:ROYALBLUE
    //DISTANCE: PURPLE
    //POLYLINE: LIME
    //PACE: GOLD
    //LAP: AQUA
    //MONEYRAISED: GREY
    //(L)TIMER: BLUE
    //(L)DISTANCE: MEDIUMPURPLE
    //(L)PACE: DarkGoldenRod

    $scope.user =  {
      name: ""
    };

    $scope.isDetailDisplayed = false;
    $scope.isRunDetailDisplayed = false;

    $scope.swipeGestureDetail = function(gesture) {
      if (gesture == 'swipe-down') {
        $scope.isDetailDisplayed = true;
      } else if (gesture == 'swipe-up') {
        $scope.isDetailDisplayed = false;
      }
    };

    $scope.swipeGestureRunDetail = function (gesture) {
      if (gesture == 'swipe-down') {
        $scope.isRunDetailDisplayed = true;
      } else if (gesture == 'swipe-up') {
        $scope.isRunDetailDisplayed = false;
      }
    };

    $scope.toggleDetail = function() {
      $scope.isDetailDisplayed = !$scope.isDetailDisplayed;
    };

    $scope.toggleRunDetail = function() {
      $scope.isRunDetailDisplayed = !$scope.isRunDetailDisplayed;
    };

    $scope.charityName = $rootScope.getSelectedCharityName();
    console.log('Run charityName: ' + $scope.charityName);

    $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();
    console.log('$scope.moneyRaised: ' + $scope.moneyRaised);


    $scope.user.name = $rootScope.getName();

    $scope.isHistoryDetailDisplayed = true;
    $scope.isRunning = false;
    $scope.isPaused = false;

    $scope.toggleRun = function() {
      $scope.isRunning = !$scope.isRunning;
    }
    //
    // $scope.lapBtnTapped = function() {
    //   if ($scope.isPaused) {
    //     resume();
    //   } else {
    //     $scope.lap();
    //   }
    // }

    // $scope.pause = function() {
    //   $scope.isPaused = true;
    // }

    // function resume() {
    //   $scope.isPaused = false;
    // }

    // function lap() {
    //   console.log("lap");
    // }


    //DOM elements for google maps overlay




    //lap, pause DOM elements
    $scope.runButtonControl = function(buttonDiv, map){
      var lapUI = document.createElement('div');
      lapUI.style.backgroundColor = '#00b9be';
      lapUI.style.align = 'center';
      lapUI.style.border = '2px solid #00b9be';
      lapUI.style.borderRadius = '3px';
      lapUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      lapUI.style.cursor = 'pointer';
      // lapUI.style.top = '10px';
      // lapUI.style.bottom = '150px';
      // lapUI.style.width = '556px';
      // lapUI.style.position = 'relative';
      lapUI.style.width = '275px';
      lapUI.style.height = '50px';
      lapUI.style.zIndex = '10';
      lapUI.style.marginBottom = '20px';
      lapUI.style.textAlign = 'center';
      lapUI.style.position = 'relative';
      lapUI.style.bottom = '5px';
      lapUI.title = 'Lap';
      buttonDiv.appendChild(lapUI);

      var lapText = document.createElement('div');
      lapText.style.color = 'rgb(255, 255, 255)';
      lapText.style.fontFamily = 'HelveticaNeue-Light';
      lapText.style.fontSize = '24px';
      lapText.style.lineHeight = '50px';
      lapText.style.lineWidth = '556px';
      lapText.style.paddingLefft = '5px';
      lapText.style.paddingRight = '5px';

      lapText.innerHTML = 'Lap';
      lapUI.appendChild(lapText);

      $scope.removeLap = function(){
        buttonDiv.removeChild(lapUI);
        console.log('%cremoved lap from buttonDiv' , 'color: Aqua');
      }

      $scope.addLap = function(){
        buttonDiv.appendChild(lapUI);
      }

      lapUI.addEventListener('click', function () {
        $scope.lap();
        //$scope.lapNumber;
        console.log('%clap activated', 'color: Teal');
      });


      var pauseUI = document.createElement('div');
      pauseUI.style.backgroundColor = '#ffffff';
      pauseUI.style.border  = '2px solid #ffffff';
      pauseUI.style.borderRadius = '3px';
      pauseUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      pauseUI.style.cursor = 'pointer';
      // pauseUI.style.top = '10px';
      // pauseUI.style.width = '556px';
      pauseUI.style.width = '275px';
      pauseUI.style.height = '50px';
      pauseUI.style.zIndex = '10';
      pauseUI.style.marginBottom = '25px';
      pauseUI.style.textAlign = 'center';
      pauseUI.style.margin = 'inherit auto';
      pauseUI.style.position = 'relative';
      pauseUI.style.bottom = '5px';
      pauseUI.title = 'Pause';
      buttonDiv.appendChild(pauseUI);

      var pauseText = document.createElement('div');
      pauseText.style.color = '#00b9be';
      pauseText.style.fontFamily = 'Roboto,Arial,sans-serif';
      pauseText.style.fontSize = '24px';
      pauseText.style.lineHeight = '50px';
      pauseText.style.lineWidth = '556px';
      // pauseText.style.paddingLeft = '5px';
      // pauseText.style.paddingRight = '5px';
      pauseText.innerHTML = 'Pause';
      pauseUI.appendChild(pauseText);

      $scope.removePause = function(){
        buttonDiv.removeChild(pauseUI);
        console.log("%cremoved pause button", 'color: Green');
      }

      $scope.addPause = function(){
        buttonDiv.appendChild(pauseUI);
        console.log('%cadded pause button', 'color: Green');
      }

      pauseUI.addEventListener('click', function(){
        console.log('%cPause button activated', 'color: Teal');
        $scope.pauseRun();

      });


    }

    //resume, stop DOM elements
    $scope.pausedControl = function(pausedDiv, map){
      var resumeUI = document.createElement('div');
      resumeUI.style.backgroundColor = '#00b9be';
      resumeUI.style.align = 'center';
      resumeUI.style.border = '2px solid #00b9be';
      resumeUI.style.borderRadius = '3px';
      resumeUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      resumeUI.style.cursor = 'pointer';
      // resumeUI.style.top = '10px';
      // resumeUI.style.height = '50px';
      // resumeUI.style.width = '556px';
      // resumeUI.style.bottom = '150px';
      // resumeUI.style.position = 'relative';
      resumeUI.style.width = '275px';
      resumeUI.style.bottom = '25px';
      resumeUI.style.zIndex = '10';
      resumeUI.style.marginBottom = '20px';
      resumeUI.style.textAlign = 'center';
      resumeUI.style.position = 'relative';
      resumeUI.style.bottom = '5px';
      resumeUI.title = 'Lap';
      pausedDiv.appendChild(resumeUI);

      var resumeText = document.createElement('div');
      resumeText.style.color = 'rgb(255, 255, 255)';
      resumeText.style.fontFamily = 'Roboto,Arial,sans-serif';
      resumeText.style.fontSize = '24px';
      resumeText.style.lineHeight = '50px';
      resumeText.style.lineWidth = '556px';
      resumeText.style.paddingLefft = '5px';
      resumeText.style.paddingRight = '5px';
      resumeText.innerHTML = 'Resume';
      resumeUI.appendChild(resumeText);

      resumeUI.addEventListener('click', function () {
        console.log('%cresume activated', 'color: Teal');
        $scope.resumeRun();

      });

      $scope.removeResume = function(){
        pausedDiv.removeChild(resumeUI);
      }

      $scope.addResume = function(){
        pausedDiv.appendChild(resumeUI);
      }

      var stopUI = document.createElement('div');
      stopUI.style.backgroundColor = '#ce1d1f';
      stopUI.style.align = 'center';
      stopUI.style.border = '2px solid #ce1d1f';
      stopUI.style.borderRadius = '3px';
      stopUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      stopUI.style.cursor = 'pointer';
      // stopUI.style.top = '10px';
      // stopUI.style.height = '50px';
      // stopUI.style.width = '556px';
      // stopUI.style.bottom = '150px';
      // stopUI.style.position = 'relative';
      stopUI.style.height = '50px';
      stopUI.style.width = '275px';
      stopUI.style.zIndex = '10';
      stopUI.style.marginBottom = '25px';
      stopUI.style.textAlign = 'center';
      stopUI.style.position = 'relative';
      stopUI.style.bottom = '5px';
      stopUI.title = 'Lap';
      pausedDiv.appendChild(stopUI);

      var stopText = document.createElement('div');
      stopText.style.color = 'rgb(255, 255, 255)';
      stopText.style.fontFamily = 'Roboto,Arial,sans-serif';
      stopText.style.fontSize = '24px';
      stopText.style.lineHeight = '50px';
      stopText.style.lineWidth = '556px';
      stopText.style.paddingLefft = '5px';
      stopText.style.paddingRight = '5px';
      stopText.innerHTML = 'Stop';
      stopUI.appendChild(stopText);

      stopUI.addEventListener('click', function () {
        console.log('%c showing ensure stop...', 'color: Teal');
        $scope.showEnsureStop();
      });

      $scope.removeStop = function(){
        pausedDiv.removeChild(stopUI);
      }

      $scope.addStop = function(){
        pausedDiv.appendChild(stopUI);
      }

      $scope.showEnsureStop = function(){
        var ensureStop = $ionicPopup.show({
          title: 'Are you sure you want to stop?',
          //subTitle: 'Whatever you want',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Stop Run</b>',
              type: 'stop-popup button-positive',
              onTap: function(e) {
                console.log('%cstop activated', 'color: Teal');
                return $scope.stopRun();

              }
            }
          ]
        })
      }



    }

    //actual run information 'drop down'
    $scope.runInfoControl = function(infoDiv, map, drop){
      var infoUI = document.createElement('div');
      infoUI.style.backgroundColor = '#ffffff';
      infoUI.style.border = '2px solid #00b9be';
      infoUI.style.borderRadius = '3px';
      infoUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      infoUI.style.cursor = 'pointer';
      infoUI.style.height = '400px';
      infoUI.style.width = '1000px';
      infoUI.style.top = '100px';
      infoUI.style.textAlign = 'center';
      infoUI.title = 'Info';
      infoDiv.appendChild(infoUI);

      var durationDiv = document.createElement('div');
      durationDiv.id = 'durationDiv';
      durationDiv.style.height = '100px';
      durationDiv.style.width = '1000px';
      durationDiv.style.title = 'Duration';
      infoUI.appendChild(durationDiv);

      var durationLabelText = document.createElement('p');
      durationLabelText.id = 'durationLabelText';
      durationLabelText.innerHTML = $scope.minutes + ' ' + $scope.seconds;
      durationDiv.appendChild(durationLabelText);

      var durationTimeText = document.createElement('p');
      durationTimeText.id = 'durationTimeText';
      durationLabelText.innerHTML = 'durationTime';
      durationDiv.appendChild(durationTimeText);

      var divider1 = document.createElement('hr');
      divider1.id = 'divider1';
      infoUI.appendChild(divider1);

      var distanceDiv = document.createElement('div');
      distanceDiv.id = 'distanceDiv';
      distanceDiv.style.height = '100px';
      distanceDiv.style.width = '1000px';
      distanceDiv.title = 'Distance';
      infoUI.appendChild(distanceDiv);

      var distanceLabelText = document.createElement('p');
      distanceLabelText.id = 'distanceLabelText';
      distanceLabelText.innerHTML = 'Distance';
      distanceDiv.appendChild(distanceLabelText);

      var distanceTrackerText = document.createElement('p');
      distanceTrackerText.id = 'distanceTrackerText';
      distanceTrackerText.innerHTML = 'DistanceTrackerText';
      distanceDiv.appendChild(distanceTrackerText);

      var divider2 = document.createElement('hr');
      divider2.id = 'divider2';
      infoUI.appendChild(divider2);

      var paceDiv = document.createElement('div');
      paceDiv.id = 'paceDiv';
      paceDiv.style.height = '100px';
      paceDiv.style.width = '1000px';
      paceDiv.style.title = 'Pace';
      infoUI.appendChild(paceDiv);

      var paceLabelText = document.createElement('p');
      paceLabelText.id = 'paceLabelText';
      paceLabelText.innerHTML = 'Pace';
      paceDiv.appendChild(paceLabelText);

      var paceTrackerText = document.createElement('p');
      paceTrackerText.id = 'paceTrackerText';
      paceTrackerText.innerHTML = 'paceTrackerText';
      paceDiv.appendChild(paceTrackerText);

      var divider3 = document.createElement('hr');
      divider3.id = 'divider3';
      infoUI.appendChild(divider3);

      var fundsRaisedDiv = document.createElement('div');
      fundsRaisedDiv.id = 'fundsRaisedDiv';
      fundsRaisedDiv.style.height = '100px';
      fundsRaisedDiv.style.width = '1000px';
      fundsRaisedDiv.title = 'fundsRaised';
      infoUI.appendChild(fundsRaisedDiv);

      var fundsRaisedLabelText = document.createElement('p');
      fundsRaisedLabelText.id = 'fundsRaisedLabelText';
      fundsRaisedLabelText.innerHTML = 'Funds Raised';
      fundsRaisedDiv.appendChild(fundsRaisedLabelText);

      var fundsRaisedTrackerText = document.createElement('p');
      fundsRaisedTrackerText.id = 'fundsRaisedTrackerText';
      fundsRaisedTrackerText.innerHTML = 'funds Raised tracker text';
      fundsRaisedDiv.appendChild(fundsRaisedTrackerText);




    };

    //start dreamrun button DOM shit
    $scope.startControl = function(startDiv, map){

      var startUI = document.createElement('div');
      startUI.style.backgroundColor = '#00b9be';
      //startUI.style.position = 'relative';
      startUI.style.border  = '2px solid #00b9be';
      startUI.style.borderRadius = '3px';
      startUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      startUI.style.cursor = 'pointer';
      // startUI.style.top = '10px';
      // startUI.style.left = '300px';
      // startUI.style.right = '400px';
      // startUI.style.width = '800px';
      startUI.style.width = '275px';
      startUI.style.height = '50px';
      startUI.style.zIndex = '10';
      startUI.style.marginBottom = '25px';
      startUI.style.textAlign = 'center';
      startUI.title = 'Start dreamrun';
      startUI.style.margin = 'inherit auto';
      startUI.style.position = 'relative';
      startUI.style.bottom = '5px';

      startDiv.appendChild(startUI);

      var startText = document.createElement('div');
      startText.style.color = 'rgb(255, 255, 255)';
      startText.style.fontFamily = 'Roboto,Arial,sans-serif';
      startText.style.fontSize = '24px';
      startText.style.lineHeight = '50px';
      startText.style.lineWidth = '556px';
      startText.innerHTML = 'Start My DREAM<b>RUN</b>';
      // startText.style.paddingLeft = '5px';
      // startText.style.paddingRight = '5px';
      startUI.appendChild(startText);

      $scope.removeStartUI = function(){
        startDiv.removeChild(startUI);
      }

      startUI.addEventListener('click', function(){



        $scope.isRunning = !$scope.isRunning;

        console.log('%cStart DreamRun button clicked', 'color: red');



        if(!$scope.map){
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Starting your dreamrun',
          showBackdrop: false
        });

        $rootScope.hide();
        $scope.startRun();

      });

    };

    //if you want to view your run summary, ya gotta click this thing
    $scope.summaryButtonControl = function(summaryButtonDiv, map){
      var summaryButtonUI = document.createElement('div');
      summaryButtonUI.style.backgroundColor = '#ffffff';
      summaryButtonUI.style.border  = '2px solid #ffffff';
      summaryButtonUI.style.borderRadius = '3px';
      summaryButtonUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      summaryButtonUI.style.cursor = 'pointer';
      // summaryButtonUI.style.top = '10px';
      // summaryButtonUI.style.height = '50px';
      // summaryButtonUI.style.width = '556px';
      summaryButtonUI.style.height = '50px';
      summaryButtonUI.style.width = '275px';
      summaryButtonUI.style.zIndex = '10';
      summaryButtonUI.style.marginBottom = '25px';
      summaryButtonUI.style.textAlign = 'center';
      summaryButtonUI.title = 'Pause';
      summaryButtonUI.style.position = 'relative';
      summaryButtonUI.style.bottom = '5px';

      summaryButtonDiv.appendChild(summaryButtonUI);

      var summaryButtonText = document.createElement('div');
      summaryButtonText.style.color = '#00b9be';
      summaryButtonText.style.fontFamily = 'Roboto,Arial,sans-serif';
      summaryButtonText.style.fontSize = '24px';
      summaryButtonText.style.lineHeight = '50px';
      summaryButtonText.style.lineWidth = '556px';
      summaryButtonText.style.paddingLeft = '5px';
      summaryButtonText.style.paddingRight = '5px';
      summaryButtonText.innerHTML = 'RunSummary';
      summaryButtonUI.appendChild(summaryButtonText);

      $scope.removeRunSummaryButton = function(){
        summaryButtonDiv.removeChild(summaryButtonUI);
        console.log("Removed Run Summary button");
      }

      summaryButtonUI.addEventListener('click', function(){
        console.log('run summary button clicked');
      });
    }

    //Center-Map Button
    $scope.locateControl = function(locateDiv, map){

      var locateUI = document.createElement('img');
      locateUI.src = "img/locate-me-icon.png";
      locateUI.style.backgroundColor = '#fff';
      locateUI.style.color = '#808080';
      locateUI.style.borderRadius = '50%';
      locateUI.style.cursor = 'pointer';
      locateUI.style.width = '45px';
      locateUI.style.height = '45px';
      locateUI.style.position = 'absolute';
      locateUI.style.bottom = '100px';
      locateUI.style.right = '0';
      locateUI.style.padding = '10px';
      locateUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      locateDiv.appendChild(locateUI);

      $scope.removeLocateUI = function(){
        locateDiv.removeChild(locateUI);
      }

      $scope.addOriginalPositionLocateUI = function(){
        locateUI.style.position = 'absolute';
        locateUI.style.bottom = '90px';
        locateUI.style.left = '72vw';
        locateDiv.appendChild(locateUI);
      }

      $scope.addRepositionedLocateUI = function(){
        locateUI.style.position = 'absolute';
        locateUI.style.bottom = '170px';
        locateUI.style.left = '72vw';
        locateDiv.appendChild(locateUI);
      }

      locateUI.addEventListener('click', function(){
        $scope.centerOnMe()
      })
    }

    // //run functions
    // var coordinateArrayUpdater;
    // //not really an array updater, more of a distance checker
    // $scope.coordsArrayUpdater = function(){
    //   // console.log('getCoords array function activated');
    //
    //   $scope.routeCoords  = [];
    //   // console.log('Empty route coords array initialized');
    //
    //   coordinateArrayUpdater = $interval(function(){
    //     navigator.geolocation.getCurrentPosition(function(pos){
    //       console.log('%cSetting my latLng in getCoordsArray', 'color: Purple');
    //       $scope.myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //       // console.log('myLatLng: ' + $scope.myLatLng)
    //     });
    //     console.log('%cmyLatLng update check: ' + $scope.myLatLng, 'color: Purple');
    //     $scope.routeCoords.push($scope.myLatLng);
    //
    //     console.log('%crouteCoords array: ' +  $scope.routeCoords, 'color: Purple');
    //     $scope.distance =  google.maps.geometry.spherical.computeLength({
    //       path:  $scope.routeCoords
    //     });
    //     console.log('%cDistance: ' + $scope.distance, 'color: Purple');
    //     console.log('%cExiting coordsArrayUpdater at interval', 'color: Purple');
    //   }, 2000);
    // }

    // doesnt really matter if the updater runs when paused- better than having it reset the coord array which this does
    // $scope.pauseCoordsArrayUpdater = function(){
    //   console.log('pauseCoordsArrayUpdater entered');
    //   $interval.cancel(coordinateArrayUpdater);
    //   $interval.
    //   // coordinateArrayUpdater = undefined;
    // }

    // $scope.resumeCoordsArrayUpdater = function(){
    //   console.log('coordsArrayUpdater resumed');
    //   $scope.coordsArrayUpdater();
    // }

    // $scope.stopCoordsArrayUpdater = function(){
    //   console.log('%cStopping coords array updater....', 'color: Purple');
    //   $interval.cancel(coordinateArrayUpdater);
    //   coordinateArrayUpdater = undefined;
    //
    //   //setting distance = 1 since is currently 0 as im not moving
    //   $scope.distance = 1;
    //   console.log('%cDistance reset: ' + $scope.distance, 'color: Purple');
    //
    //   $scope.routeCoords = [];
    // }

    //polyline functions
    $scope.userCoords = function(){
      console.log('%cuserCoords function activated', 'color: Purple');

      navigator.geolocation.getCurrentPosition(function(pos){
        console.log('%cGetting current position for user coords...', 'color: Purple');
        $scope.myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        console.log('%cuser coords: ' + $scope.myLatLng, 'color: Purple');
      });
      console.log('%cReturning myLatLng from userCoords: ' + $scope.myLatLng, 'color: Purple');
      console.log('%cuser Coords Interval mark, refreshing coords', 'color: Purple');
      return $scope.myLatLng;

    }


    //calculator for money raised on this run
    $scope.runMoneyRaisedCalculator = function(distance){
      console.log('run Money Raised Calculator called with distance value of: ' + distance);
      var moneyPerMile = $rootScope.getMoneyRaisedPerMile();
      console.log('Money per mile' + moneyPerMile);
      $scope.moneyCalc = moneyPerMile * distance;
      console.log('Current money raised amount ($scope.moneyCalc): ' + $scope.moneyCalc)
      $rootScope.setRunMoneyRaisedAmount($scope.moneyCalc);
      console.log('Run Money Raised Amount set as: ' + $rootScope.getRunMoneyRaisedAmount());
    }

    //distance functions
    var distanceInitializer;
    $scope.distanceCoords = [];
    $scope.runDistance = function(){

      console.log('%cEmpty coorindate arry for distance function initialized' + $scope.distanceCoords, 'color: Purple');

      distanceInitializer = $interval(function(){
        var currentCoords = $scope.userCoords();
        console.log('%cuser Coords called from within distance initializers: ' + currentCoords, 'color: Purple');

        if(currentCoords == undefined){
          console.log('Current coords undefined');
        } else {
          $scope.distanceCoords.push(currentCoords);
          console.log('%cCurrent coords pushed to distance array. distanceCoords values: ' + $scope.distanceCoords, 'color: Purple');
        }
        $rootScope.setRunPath($scope.distanceCoords);
        console.log('Run path global var set as: ' + $rootScope.getRunPath());
        $scope.distance = google.maps.geometry.spherical.computeLength({
          path: $scope.distanceCoords
        });
        console.log('%cDistance: ' +$scope.distance, 'color: Purple');
        // $scope.runMoneyRaisedCalculator($scope.distance);
        $scope.runMoneyRaisedCalculator(10);
        $rootScope.setRunDistance($scope.distance);
        console.log('%cRun Distance (global) set as: ' + $rootScope.getRunDistance(), 'color: Purple');
        console.log('%cExiting runDistance at interval', 'color: Purple');
      }, 2000);
    }

    $scope.stopRunDistance = function(){
      console.log('%cStopping runDistance ....', 'color: Purple');
      $interval.cancel(distanceInitializer);
      distanceInitializer = undefined;

      //setting distance = 1 since is currently 0 as im not moving
      $scope.distance = 1;
      console.log('%cDistance reset: ' + $scope.distance, 'color: Purple');

      // $scope.distanceCoords = [];
    }

    var polyDrawer;
    $scope.runPolyline = function(){
      console.log('%crunPolyline function activated', 'color: Lime');

      $scope.polyCoords = [];
      console.log('%cempty poly coords array initialized', 'color: Lime');
      // var drawerTestCoords = {lat: 38.9042049, lng: -77.0473209};
      // $scope.polyCoords.push(drawerTestCoords);
      polyDrawer = $interval(function(){

        var currentCoords = $scope.userCoords();
        console.log('%c userCoords called from inside interval in polyDrawer', 'color: Lime');

        // var currentCoords = $scope.getUserCoords();
        // console.log('%c current coords: ' + currentCoords, 'color: Lime');

        $scope.polyCoords.push(currentCoords);
        console.log('%cpoly coords array:' + $scope.polyCoords, 'color: Lime');

        $scope.runPath = new google.maps.Polyline({
          path: $scope.polyCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        $scope.runPath.setMap($scope.map);
        console.log('%crunPath.setMap completed', 'color: Lime');
        console.log('%cexiting Polyline at interval mark', 'color: Lime');
      }, 3000);

    }

    $scope.pausePolylineDrawer = function(){
      console.log('%ccoordinate retrieval refresher paused', 'color: Lime');
      $interval.cancel(polyDrawer);
      polyDrawer = undefined;
    }

    $scope.resumePolylineDrawer = function(){
      console.log('%cresumePolylineDrawer function activated', 'color: Lime');
      $scope.runPolyline();
    }


    //timer functions
    var startTimer;
    $scope.startTimer = function(){
      $scope.minutes = 0;
      $scope.seconds = 0;
      startTimer = $interval(function(){
        console.log('%cTimer activated', 'color: RoyalBlue');
        if($scope.seconds < 60) {
          console.log('%cseconds checked, incremented', 'color: RoyalBlue');
          $scope.seconds++;
          if($scope.seconds < 10){
            $scope.seconds = '0' + $scope.seconds;
          }
          console.log('%cseconds: ' + $scope.seconds, 'color: RoyalBlue');
          console.log('%cminutes: ' + $scope.minutes, 'color: RoyalBlue');
          return $scope.seconds, $scope.minutes;

        } else  if ($scope.seconds > 59) {
          console.log('%cseconds reached 60, reset to 0', 'color: RoyalBlue');
          $scope.seconds = 00;
          console.log('%cseconds: ' + $scope.seconds, 'color: RoyalBlue');
          $scope.minutes++;
          console.log('%cminutes: ' + $scope.minutes, 'color: RoyalBlue');
          console.log('minutes incremented');
        }

        $rootScope.setRunMinutes($scope.minutes);
        $rootScope.setRunSeconds($scope.seconds);
        console.log('%cRun time (global) set as: ' + $rootScope.getRunTime(), 'color: RoyalBlue');

        console.log('%cTimer Interval mark', 'color: RoyalBlue');
      }, 1000);
    }

    $scope.pauseTimer = function(){
      $interval.cancel(startTimer);
      startTimer = undefined;
    }

    $scope.resumeTimer = function(){
      console.log('%cresume timer function activated', 'color: RoyalBlue');
      $scope.startTimer();
    }

    $scope.stopTimer = function(){
      console.log('%cstop timer function activated', 'color: RoyalBlue');
      $interval.cancel(startTimer);
      startTimer = undefined;

    }

    //lap functions

    var startLapTimer;
    $scope.startLapTimer = function(){
      $scope.lapSeconds = 0;
      $scope.lapMinutes = 0;
      startLapTimer = $interval(function(){
        console.log('%cLap timer started', 'color: Blue');
        if($scope.lapSeconds < 60) {
          console.log('%cseconds checked, incremented', 'color: RoyalBlue');
          $scope.lapSeconds++;
          if($scope.lapSeconds < 10){
            $scope.lapSeconds = '0' + $scope.lapSeconds;
          }
          console.log('%cseconds: ' + $scope.seconds, 'color: RoyalBlue');
          console.log('%cminutes: ' + $scope.minutes, 'color: RoyalBlue');
        } else  if ($scope.seconds > 59) {
          console.log('%cseconds reached 60, reset to 0', 'color: RoyalBlue');
          $scope.lapSeconds = 0;
          console.log('%cseconds: ' + $scope.seconds, 'color: RoyalBlue');
          $scope.lapMinutes++;
          console.log('%cminutes: ' + $scope.lapMinutes, 'color: RoyalBlue');
          console.log('minutes incremented');
        }


        // if($scope.lapSeconds < 60) {
        //   console.log('%cLap seconds checked, incremented', 'color: Blue');
        //   $scope.lapSeconds++;
        //   console.log('%cLap seconds: ' + $scope.lapSeconds, 'color: Blue');
        //   // $rootScope.setLapSeconds($scope.lapSeconds);
        //   // $rootScope.setLapMinutes($scope.lapMinutes);
        //   // console.log('Lap Minutes global var: ' + $rootScope.getLapMinutes() + '; Lap seconds  global var: ' + $rootScope.getLapSeconds());
        //
        //   if ($scope.lapSeconds > 59) {
        //     console.log('%cLap seconds reached 60, reset to 0', 'color: Blue');
        //     $scope.lapSeconds = 0;
        //     console.log('%cLap seconds: ' + $scope.lapSeconds, 'color: Blue');
        //     $scope.lapMinutes++;
        //     console.log('%cLap minutes: ' + $scope.lapMinutes, 'color: Blue');
        //     console.log('%cLap minutes incremented', 'color: Blue');
        //
        //     // $rootScope.setLapSeconds($scope.lapSeconds);
        //     // $rootScope.setLapMinutes($scope.lapMinutes);
        //     // console.log('Lap Minutes global var: ' + $rootScope.getLapMinutes() + '; Lap seconds  global var: ' + $rootScope.getLapSeconds());
        //
        //   }
        // }
        console.log('%cLap Timer interval mark', 'color: Blue');
      }, 1000);
    }

    $scope.pauseLapTimer = function(){
      $interval.cancel(startLapTimer);
      startLapTimer = undefined;
    }

    $scope.resumeLapTimer = function(){
      console.log('%cLap timer resumed', 'color: Blue');
      $scope.startLapTimer();
    }

    $scope.stopLapTimer = function(){
      console.log('%cLap timer stopped', 'color: Blue');
      $interval.cancel(startLapTimer);
      startLapTimer = undefined;
    }

    $scope.laps = [];

    $scope.lapCoords = [];
    var lapDistanceInitializer;
    $scope.getLapDistance = function(){
      console.log('%cLap distance function activated', 'color: MediumPurple');


      console.log('%cEmpty lap coords array initialized: ' + $scope.lapCoords, 'color: MediumPurple');

      lapDistanceInitializer = $interval(function(){
        console.log('%cGet current coords called from lap distance', 'color: MediumPurple');

        var currentCoords = $scope.userCoords();

        if(currentCoords == undefined){
          console.log('Current coords undefined');
        } else {
          $scope.lapCoords.push(currentCoords);
          console.log('%cCurrent coords pushed to distance array. distanceCoords values: ' + $scope.lapCoords, 'color: MediumPurple');
        }


        // $rootScope.setLapPath($scope.lapCoords);
        // console.log('Lap path global var set as: '+$rootScope.getPath());

        $scope.marker = new google.maps.Marker({
          position: currentCoords,
          map: $scope.map
        })

        $scope.lapDistance = google.maps.geometry.spherical.computeLength({
          path: $scope.lapCoords
        });
        console.log('%cLap distance: ' + $scope.lapDistance, 'color: MediumPurple');

        // $rootScope.setLapDistance($scope.lapDistance);
        // console.log('Lap distance global var: ' + $rootScope.getLapDistance());
      }, 2000);
    }

    $scope.stopLapDistance = function(){
      console.log('%cStopping lap distance...', 'color: MediumPurple');
      $interval.cancel(lapDistanceInitializer);
      lapDistanceInitializer = undefined;
    }


    $scope.setStartingLatLng = function(){
      console.log('setting start coords');
      $scope.startLatLng = $scope.getCurrentCoords();
      console.log('starting coordinates are: ' + $scope.startLatLng);
    }


    //pace functions
    var paceInitializer;
    $scope.paceCalculator = function(){
      console.log('%cpace calculator called', 'color: Gold');

      //check by hard coding distance

      //var metersPerMile = 1609.34;
      var milesPerMeter = 0.000621371;

      //console.log('%cPace calculator seconds time check- minutes: ' + $scope.minutes + ';  seconds: ' + $scope.seconds, 'color: Gold');

      paceInitializer = $interval(function(){
        var paceSeconds = $scope.seconds;
        console.log('%cPace Seconds: ' + paceSeconds, 'color:Gold');
        var paceMinutes = $scope.minutes;
        console.log('%cPace Minutes: ' + paceMinutes, 'color:Gold');
        var paceDistance = $scope.distance;
        console.log('%cPace Distance: ' + paceDistance, 'color:Gold');

        var toSeconds = paceMinutes * 60;
        var time = paceSeconds + toSeconds;
        console.log('%cTime in seconds: ' + time, 'color: Gold');

        var distanceInMiles = paceDistance * milesPerMeter;
        console.log('%cDistance in miles: ' + distanceInMiles, 'color: Gold');


        //10 is hard coded value since value is 0 when testing
        milesPerSecond = time / 10;
        //milesPerSecond = time / distanceInMiles;
        console.log('%cMiles per second: ' + milesPerSecond, 'color: Gold');

        $scope.pace = milesPerSecond / 60;
        console.log('%cMiles per minute (Pace): ' + $scope.pace, 'color: Gold');

        $rootScope.setRunPace($scope.pace);
        console.log('Pace (global var) set as: ' + $rootScope.getRunPace());


      }, 2100);
    }

    $scope.stopPaceCalculator = function(){
      console.log('%cStopping pace calculator... ', 'color: Gold');
      $interval.cancel(paceInitializer);
      paceInitializer = undefined;
    }

    var lapPaceInitializer;
    $scope.lapPaceCalculator = function(){
      console.log('%cLap Pace Calculator Called', 'color: DarkGoldenRod ');
      $scope.lapPace = 0;
      //var metersPerMile = 1609.34;
      var milesPerMeter = 0.000621371;

      lapPaceInitializer = $interval(function(){

        var lapPaceSeconds = $scope.lapSeconds;
        console.log('%cLap Pace Seconds: ' + lapPaceSeconds, 'color: DarkGoldenRod ');
        var lapPaceMinutes = $scope.lapMinutes;
        console.log('%cLap Pace Minutes: ' + lapPaceMinutes, 'color: DarkGoldenRod ');
        var lapPaceDistance = $scope.lapDistance;
        console.log('%cLap Pace Distance: ' + lapPaceDistance, 'color: DarkGoldenRod ');


        var toSeconds = lapPaceMinutes * 60;
        var time = lapPaceSeconds + toSeconds;
        console.log('%cLapTime in seconds: ' + time, 'color: DarkGoldenRod ');

        var distanceInMiles = lapPaceDistance * milesPerMeter;
        console.log('%cDistance in miles: ' + distanceInMiles, 'color: DarkGoldenRod ');

        milesPerSecond = distanceInMiles / time;
        console.log('%cMiles per second: ' + milesPerSecond, 'color: DarkGoldenRod ');

        $scope.lapPace = milesPerSecond / 60;
        console.log('%cMiles per minute (Pace): ' + $scope.lapPace, 'color: DarkGoldenRod ');

        $rootScope.setLapPace($scope.lapPace);
        console.log('Lap pace global var: ' + $rootScope.getLapPace());

      }, 2100);
    }


    $scope.stopLapPaceCalculator = function(){
      console.log('%cStopping pace calculator... ', 'color: DarkGoldenRod ');
      $interval.cancel(lapPaceInitializer);
      lapPaceInitializer = undefined;

    }




    $scope.lapPushNumbers = [];
    $scope.lapPushDistances = [];
    $scope.lapPushSeconds = [];
    $scope.lapPushMinutes = [];
    $scope.lapPushPace = [];
    $scope.lat = [];
    $scope.long = [];
    // $scope.lapLat = [];
    // $scope.lapLong = [];
    //
    // $scope.lapCoordsDeterminant = function(i, split){
    //   var splitNumber = i;
    //   if (i = 0 || i % 2 == 0) {
    //     var coordSplit = split.toString().split('(');
    //     var firstSplit = coordSplit[0];
    //     var secondSplit = coordSplit[1];
    //     console.log('Coord split ' + splitNumber + 'first split: ' + firstSplit);
    //     console.log('Coord split ' + splitNumber + 'second split: ' + secondSplit);
    //     $scope.lapLat.push(secondSplit);
    //     console.log('$scope.lapLat: ' + $scope.lapLat);
    //
    //   } else {
    //     var coordSplit = split.toString().split(')');
    //     var firstSplit = coordSplit[0];
    //     var secondSplit = coordSplit[1];
    //     console.log('Coord split ' + splitNumber + 'first split: ' + firstSplit);
    //     console.log('Coord split ' + splitNumber + 'second split: ' + secondSplit);
    //     $scope.lapLong.push(firstSplit);
    //     console.log('$scope.lapLong: ' + $scope.lapLong);
    //   }
    // }


    $scope.coordsDeterminant = function(i, split) {
      var splitNumber = i;
      if (i = 0 || i % 2 == 0) {
        coordSplit = split.toString().split('(');
        var firstSplit = coordSplit[0];
        var secondSplit = coordSplit[1];
        console.log('Coord split ' + splitNumber + 'first split: ' + firstSplit);
        console.log('Coord split ' + splitNumber + 'second split: ' + secondSplit);
        $scope.lat.push(secondSplit);
        console.log('$scope.lat: ' + $scope.lat);

      } else {
        coordSplit = split.toString().split(')');
        var firstSplit = coordSplit[0];
        var secondSplit = coordSplit[1];
        console.log('Coord split ' + splitNumber + 'first split: ' + firstSplit);
        console.log('Coord split ' + splitNumber + 'second split: ' + secondSplit);
        $scope.long.push(firstSplit);
        console.log('$scope.long: ' + $scope.long);

      }
    }

    //map states
    $scope.mapCreated = function(map){
      $scope.map = map;


      $scope.mapOptions = map.setOptions({
        center: $scope.myLatLng,
        zoom: 19,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });




      // var welcomeControlDiv = document.createElement('div');
      // var welcomeControl = $scope.welcomeControl(welcomeControlDiv, map);
      //
      // welcomeControlDiv.index = 1;
      // map.controls[google.maps.ControlPosition.TOP].push(welcomeControlDiv);

      var startControlDiv = document.createElement('div');
      var startControl = $scope.startControl(startControlDiv, map);


      startControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(startControlDiv);



      var locateControlDiv = document.createElement('div');
      var locateControl = $scope.locateControl(locateControlDiv, map);

      locateControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locateControlDiv);
      // $scope.mapOptions.setMap($scope.map);

    };

    $scope.startRun  = function(){
      console.log('%cStarting run...', 'color: HotPink');


      console.log("%cAttempting to remove start button...", 'color: HotPink');
      $scope.removeStartUI();
      $scope.removeLocateUI();
      $scope.addRepositionedLocateUI();

      var buttonControlDiv = document.createElement('div');
      var buttonControl = $scope.runButtonControl(buttonControlDiv, $scope.map);

      buttonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(buttonControlDiv);

      $scope.run();

    };


    // $scope.lapPushLat = [];
    // $scope.lapPushLong = [];

    $scope.lap = function(){


      console.log('%cLap Number: ' + $scope.lapNumber, 'color: Aqua');
      console.log('%cLap Seconds: ' + $scope.lapSeconds, 'color: Aqua');
      console.log('%cLap minutes: ' + $scope.lapMinutes, 'color: Aqua');
      console.log('%cLap distance: ' + $scope.lapDistance, 'color: Aqua');
      console.log('%cLap Pace: ' + $scope.lapPace, 'color: Aqua');

      if($scope.lapNumber == undefined){
        $scope.lapNumber = 0;
        var lapNumberString = $scope.lapNumber.toString();
        console.log(' LAP NUMBER undefined, SET TO 0');
        $scope.lapPushNumbers.push(lapNumberString);
      } else{
        var lapNumberString = $scope.lapNumber.toString();
        $scope.lapPushNumbers.push(lapNumberString);
      }
      if($scope.lapDistance == undefined){
        $scope.lapDistance = 0;
        var lapDistanceString = $scope.lapDistance.toString();
        console.log(' LAP DISTANCE undefined, SET TO 0');
        $scope.lapPushDistances.push(lapDistanceString);
      } else{
        var lapDistanceString = $scope.lapDistance.toString();
        $scope.lapPushDistances.push(lapDistanceString);
      }
      if($scope.lapSeconds == undefined){
        $scope.lapSeconds = 0;
        var lapSecondsString = $scope.lapSeconds.toString();
        console.log(' LAP SECONDS undefined, SET TO 0');
        $scope.lapPushSeconds.push(lapSecondsString);
      } else{
        var lapSecondsString = $scope.lapSeconds.toString();
        $scope.lapPushSeconds.push(lapSecondsString);

      }
      if($scope.lapMinutes == undefined){
        $scope.lapMinutes = 0;
        var lapMinutesString = $scope.lapMinutes.toString();
        console.log(' LAP MINUTES undefined, SET TO 0');
        $scope.lapPushMinutes.push(lapMinutesString);
      } else{
        var lapMinutesString = $scope.lapMinutes.toString();
        $scope.lapPushMinutes.push(lapMinutesString);
      }
      if($scope.lapPace == undefined){
        $scope.lapPace = 0;
        var lapPaceString = $scope.lapPace.toString();
        console.log(' LAP PACE undefined, SET TO 0');
        $scope.lapPushPace.push(lapPaceString);
      } else{
        var lapPaceString = $scope.lapPace.toString();
        $scope.lapPushPace.push(lapPaceString);
      }
      //
      // $scope.lapPushNumbers.push($scope.lapNumber);
      // $scope.lapPushDistances.push($scope.lapDistance);
      // $scope.lapPushSeconds.push($scope.lapSeconds);
      // $scope.lapPushMinutes.push($scope.lapMinutes);
      // $scope.lapPushPace.push($scope.lapPace);
      //

      // $scope.lapPushLat.push($scope.lapLat);
      // $scope.lapPushLong.push($scope.lapLong);
      console.log('lapPushNumbers: ' + $scope.lapPushNumbers);
      console.log('lapPushDistances: ' + $scope.lapPushDistances);
      console.log('lapPushSeconds: ' + $scope.lapPushSeconds);
      console.log('lapPushMinutes: ' + $scope.lapPushMinutes);
      // console.log('lapPushPace: ' + $scope.lapPushLat);
      // console.log('lapPushCoords: ' + $scope.lapPushLong);

      $scope.stopLapTimer();
      $scope.stopLapDistance();
      $scope.stopLapPaceCalculator();

      // var lapCoordString = $scope.lapCoords.toString();
      // console.log('lapCoordString: ' + lapCoordString);
      //
      // var lapCoordSplit = lapCoordString.split(',');
      // console.log('lapCoordSplit: ' + lapCoordSplit);
      // console.log('lapCoordSplit.length : ' + lapCoordSplit.length);
      //
      // var firstLapSplit = lapCoordSplit[0];
      // console.log('firstLapSplit: ' + firstLapSplit);
      //
      // var secondLapSplit = lapCoordSplit[1];
      // console.log('secondSplit: ' + secondLapSplit);
      //
      // var thirdLapSplit = lapCoordSplit[2];
      // console.log('thirdSplit: ' + thirdLapSplit);
      //
      //
      // for (var i=0; i< lapCoordSplit.length; i++){
      //   var splitNumber = i;
      //   var split = lapCoordSplit[i];
      //   if(split == ""){
      //     console.log('split value is null');
      //     i++;
      //   } else {
      //     console.log('Split ' + splitNumber + ': ' + split);
      //     $scope.lapCoordsDeterminant(i, split);
      //   }
      // }

      console.log('$scope.lapLat: ' + $scope.lapLat);
      console.log('$scope.lapLong: ' + $scope.lapLong);






      // for(var i = 0; i < $scope.lapLat.length; i++){
      //   $scope.lapLat.pop();
      //   console.log('$scope.lapLatPop: ' + $scope.lapLatPop);
      // }
      // console.log('$scope.lapLat post pop: ' + $scope.lapLat);
      // for(var i = 0; i<$scope.lapLong.length; i++){
      //   $scope.lapLong.pop();
      //   console.log('$scope.lapLongPop: ' + $scope.lapLong);
      // }
      // console.log('$scope.lapLong post pop: ' + $scope.lapLong);
      // $scope.lapSeconds = 0;
      // $scope.lapMinutes = 0;
      // $scope.lapNumber = 0;
      // $scope.lapDistance = 0;



      $scope.startLapTimer();
      $scope.getLapDistance();
      $scope.lapPaceCalculator();
      $scope.lapNumber++;
    }

    $scope.run = function(){
      //$scope.stopTimer() destroys timer. nothing registers if not destroyed
      $scope.stopTimer();
      $scope.stopPaceCalculator();
      $scope.userCoords();


      $scope.runPolyline();
      console.log('%crunPolyline called', 'color: Lime');

      $scope.startTimer();
      $scope.lap();
      $scope.lapNumber = 1;

      $scope.runDistance();
      console.log('%crunDistance called', 'color: Purple');


      $scope.paceCalculator();

    }

    $scope.pauseRun = function(){

      $scope.removeLap();
      $scope.removePause();


      $scope.pauseTimer();
      $scope.pausePolylineDrawer();
      $scope.pauseLapTimer();
      // $scope.pauseCoordsArrayUpdater();

      var pausedControlDiv = document.createElement('div');
      var pausedControl = $scope.pausedControl(pausedControlDiv, $scope.map);

      pausedControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(pausedControlDiv);
      $scope.removeLap();
      $scope.removePause();
      $scope.pauseTimer();
      $scope.pausePolylineDrawer();
      var pausedControlDiv = document.createElement('div');
      var pausedControl = $scope.pausedControl(pausedControlDiv, $scope.map);

      pausedControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(pausedControlDiv);

    }

    $scope.resumeRun = function(){
      $scope.removeStop();
      $scope.removeResume();

      //add lap and pause back in, resume counters.
      $scope.addLap();
      $scope.addPause();
      console.log('%c$scope.resumeTimer() called', 'color: RoyalBlue');
      $scope.resumeTimer();
      $scope.resumePolylineDrawer();
      $scope.resumeLapTimer();
      // $scope.resumeCoordsArrayUpdater();
    }

    $scope.stopRun = function(){

      console.log('Distance coords: '+ $scope.distanceCoords );
      $scope.postRun();
      $scope.removeResume();
      $scope.removeStop();
      $scope.removeLocateUI();

      console.log('%c$scope.stopTimer() called', 'color: RoyalBlue');
      $scope.stopTimer();
      $scope.stopLapTimer();
      $scope.stopRunDistance();
      $scope.stopLapDistance();
      $scope.stopPaceCalculator();
      $scope.stopLapPaceCalculator();

      $scope.addOriginalPositionLocateUI();

      var runSummaryButtonControlDiv = document.createElement('div');
      var runSummaryButtonControl = $scope.summaryButtonControl(runSummaryButtonControlDiv, $scope.map);

      runSummaryButtonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(runSummaryButtonControlDiv);


    }



    $scope.postRun = function(){
      var t = Date.now();
      var today = new Date(t);
      var todaySplit = today.toString().split(' ');
      console.log('t: ' + t + ' today: ' + today + ' todaySplit: ' + todaySplit);
      var runMonth = todaySplit[1];
      console.log('Run month: ' + runMonth);

      console.log('Push run- Distance: '+ $rootScope.getRunDistance());
      console.log('Push run- minutes: ' + $rootScope.getRunMinutes());
      console.log('Push run-  Seconds: ' + $rootScope.getRunSeconds());
      console.log('Push run-  Pace: ' + $rootScope.getRunPace());
      console.log('Push run-  User: ' + $rootScope.getUserId());
      console.log('Push run- Path: ' + $rootScope.getRunPath());
      console.log('Push run- Money raised amount: ' + $rootScope.getRunMoneyRaisedAmount());


      $scope.lap();
      console.log('lapPushNumbers: ' + $scope.lapPushNumbers);
      console.log('lapPushDistances: ' + $scope.lapPushDistances);
      console.log('lapPushSeconds: ' + $scope.lapPushSeconds);
      console.log('lapPushMinutes: ' + $scope.lapPushMinutes);
      console.log('lapPushPace: ' + $scope.lapPushPace);



      console.log('$scope.distanceCoords: ' +$scope.distanceCoords);

      var coordString = $scope.distanceCoords.toString();
      console.log('coordString: ' + coordString);

      var coordSplit = coordString.split(',');
      console.log('coordSplit: ' + coordSplit);
      console.log('coordSplit.length : ' + coordSplit.length);

      var firstSplit = coordSplit[0];
      console.log('firstSplit: ' + firstSplit);

      var secondSplit = coordSplit[1];
      console.log('secondSplit: ' + secondSplit);

      var thirdSplit = coordSplit[2];
      console.log('thirdSplit: ' + thirdSplit);


      for (var i=0; i< coordSplit.length; i++){
        var splitNumber = i;
        var split = coordSplit[i];
        if(split == ""){
          console.log('split value is null');
          i++;
        } else {
          console.log('Split ' + splitNumber + ': ' + split);
          $scope.coordsDeterminant(i, split);
        }
      }


      console.log('$scope.lat: ' + $scope.lat);
      console.log('$scope.long: ' + $scope.long);

      var form = {
        distance: $rootScope.getRunDistance(),
        date: Date.now(),
        month: runMonth,
        seconds: $rootScope.getRunSeconds(),
        minutes: $rootScope.getRunMinutes(),
        pace: $rootScope.getRunPace(),
        User: $rootScope.getUserId(),
        moneyRaised: $rootScope.getRunMoneyRaisedAmount(),
        charity: $rootScope.getSelectedCharityName(),
        path: {lat: [$scope.lat], long: [$scope.long]},
        laps: { number: [$scope.lapPushNumbers],
          distance: [$scope.lapPushDistances],
          seconds: [$scope.lapPushSeconds],
          minutes: [$scope.lapPushMinutes],
          pace: [$scope.lapPushPace]
        }

      }
      console.log('Form Distance: ' + form.distance);
      console.log('Form.lapDistance: ' + form.lapDistance);
      console.log('Run save form: ' + form);

      RunAPI.saveRun(form)
        .success(function(data, status, headers, config){
          //just status header for now
          console.log('saveRun API call returned success');

        })
        .error(function(err,status){
          console.log(err);
          console.log('Save run API call failed');
          $rootScope.verifyStatus(status);
        });
    }


    $scope.centerOnMe = function(){
      console.log("%cCentering", 'color: Green');
      if(!$scope.map){
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos){
        console.log('Got pos', pos);
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        // $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.hide();
      }, function(error){
        alert('Unable to get location: ' + error.message);
      });
    };


  })

  .controller('AppCtrl', function($rootScope, $scope, $window, $filter, $ionicModal, $timeout, DonationAPI, CharityAPI, AuthAPI, $ionicNavBarDelegate) {

    // $ionicNavBarDelegate.showBackButton(false)


    $scope.moneyRaised = 0;

    $scope.fetchMyPledges = function() {
      $rootScope.$broadcast("fetchMyPledges");
    }

    $scope.fetchMySponsors = function() {
      $rootScope.$broadcast("fetchMySponsors");
    }

    $scope.fetchMyHistory = function(){
      $rootScope.$broadcast("fetchMyHistory");
    };

    $rootScope.$on('fetchMySponsors', function() {
      DonationAPI.getAllSponsors($rootScope.getUserId()).success(function(data, status, headers, config){
        $scope.sponsors = [];
        $scope.moneyRaisedHolder = [];

        if(data.length == 0) {
         return $scope.noSponsor = true;
        } else {
          for (var i = 0; i < data.length; i++) {
            $scope.sponsors.push(data[i]);
            $scope.moneyRaisedHolder.push(data[i].per_mile_donation);
            console.log('data[i].per_mile_donation values: ' + data[i].per_mile_donation);
            console.log('$scope.moneyRaisedHolder: ' + $scope.moneyRaisedHolder[i] + '    ' + $scope.moneyRaisedHolder);
            console.log('Money Raised Value before addition: ' + $scope.moneyRaised);
            $scope.moneyRaised += $scope.moneyRaisedHolder[i];
            console.log('Money raised Value post addition: ' + $scope.moneyRaised);
          }
          console.log('My Sponsors JSON returned value of: ' + $scope.sponsors);
          console.log('Money raised per mile final result: ' + $scope.moneyRaised);
          $rootScope.setMoneyRaisedPerMile($scope.moneyRaised);
          console.log('$scope.getMoneyRaised per mile: ' + $rootScope.getMoneyRaisedPerMile());
        }

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });

    $rootScope.$on('fetchMyPledges',function(){
      DonationAPI.getAllPledges($rootScope.getUserId()).success(function(data, status, headers, config){
        $scope.pledges = [];
        for (var i = 0; i < data.length; i++) {
          $scope.pledges.push(data[i]);
        };

        if(data.length == 0) {
          $scope.noPledge = true;
        } else {
          $scope.noPledge = false;
        }

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });


    //history stuff
    var t = Date.now();
    var today = new Date(t);

    console.log('Today: ' +today );
    var utcToday= new Date(today.toUTCString());
    console.log('Today: ' + today + ' Converts to UTC string: ' + utcToday);
    var isoToday = new Date(today.toISOString());
    console.log('Today: ' + today + 'Converts to Iso string: ' + isoToday);
    var todaySplit = today.toString().split(' ');
    var todayMonth = todaySplit[1];
    console.log('Today month: '  + todayMonth);

    $scope.fetchMonthHistory = function(){
      $rootScope.$broadcast('fetchMonthHistory');
    }

    //log out
    $scope.logout = function() {
      $rootScope.clearAll();
      $rootScope.$broadcast('destroy');
      $window.location.href = "#/auth/signin";
    }

  })



  .controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, HistoryAPI, AuthAPI){

    $scope.isDetailDisplayed = false;
    $scope.charityName  = $rootScope.getSelectedCharityName();
    $scope.charityDescription = $rootScope.getSelectedCharityDescription();
    $scope.charityAvatar = $rootScope.getSelectedCharityAvatar();
    $scope.charityUrl = $rootScope.getSelectedCharityUrl();

    console.log('$rootScope.getSelectedCharityName: ' + $rootScope.getSelectedCharityName());

    $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();

    if($scope.charityName == undefined){
      $scope.noCharity = true;
      console.log('noCharityValue: ' + $scope.noCharity);
    }

    $scope.pastCharities = [];
    $scope.pastCharityMoneyRaised = [];

    $scope.charityHistoryCall = function(){
      HistoryAPI.getAll($rootScope.getUserId())
        .success(function(data, status, headers, config){
          console.log('inside historyAPI get all success call');
          console.log('run data legnth: ' + data.length);
          for(var i=0; i< data.length; i++){
            console.log('data['+i+'].charity: ' + data[i].charity);
            var charityIndex = $scope.pastCharities.indexOf(data[i].charity);
            console.log('charityIndex: ' + charityIndex);
            if(charityIndex == -1){
              $scope.pastCharities.push(data[i].charity);
              $scope.pastCharityMoneyRaised.push(data[i].moneyRaised);
              console.log('$scope.pastCharities['+i+']:' + $scope.pastCharities[i]);
              console.log('$scope.pastCharityMoneyRaised['+i+']: ' + $scope.pastCharityMoneyRaised[i]);
            } else {
              console.log('pastMoneyRaised array before addition: ' + $scope.pastCharityMoneyRaised);
              console.log(data[i].charity + ' is already in pastCharitiesArray');
              console.log('data['+i+'].moneyRaised: ' + data[i].moneyRaised);
              $scope.pastCharityMoneyRaised[charityIndex] = $scope.pastCharityMoneyRaised[charityIndex] + data[i].moneyRaised;
              console.log('$scope.pastCharityMoneyRaised['+charityIndex+'] post addition: ' + $scope.pastCharityMoneyRaised[charityIndex]);
            }
            // $scope.pastCharities.push(data[i].charity);
            // $scope.pastCharitiesMoneyRaised.push(data[i].moneyRaised);
            // if($scope.pastCharities.indexOf(data[i].charity) !== -1){
            //   console.log('pastCharities array already contains: ' + data[i].charity);
            // } else {
            //   $scope.pastCharities.push(data[i].charity);
            // }
          }
          console.log('$scope.pastCharities.length: ' + $scope.pastCharities.length);
          return $scope.pastCharities;
          // for(var i=0; i< $scope.pastCharities.length; i++){
          //   $scope.charity = $scope.pastCharities[i];
          //   console.log('$scope.pastCharities[i]: ' + $scope.pastCharities[i]);
          //   for(var x=0; x<data.length; x++){
          //     if($scope.charity = data[x].charity){
          //       console.log('data[i].charity: ' + data[x].charity + ' data['+x+']' + data[x].moneyRaised);
          //       $scope.thisCharityMoneyRaised =  $scope.thisCharityMoneyRaised + data[x].moneyRaised;
          //       console.log('$scope.thisCharityMoneyRaised: ' + $scope.thisCharityMoneyRaised);
          //       if($scope.thisCharityMoneyRaised == undefined || $scope.charity == undefined ||
          //       $scope.thisCharityMoneyRaised == "NaN" || $scope.charity == "NaN"){
          //         console.log('$scope.thisCharityMoneyRaised or $scope.charity is undefined');
          //       } else {
          //         $scope.charityListInformation.push($scope.charity, $scope.thisCharityMoneyRaised);
          //         console.log('$scope.charityListInformation: ' + $scope.charityListInformation);
          //         console.log('$scope.charityListInformation.length: ' + $scope.charityListInformation.length);
          //         // console.log('$scope.charityListInformation['+x+']: ' + $scope.charityListInformation[x]);
          //         console.log('$scope.charityListInformation['+x+'].charity: ' + $scope.charityListInformation.charity);
          //         console.log('$scope.charityListInformation['+x+'].moneyRaised: ' + $scope.charityListInformation.moneyRaised);
          //       }
          //
          //     }
          //   }
          // }
        })
        .error(function(err){
          console.log('History API call getAll failed');
        });
    }



    //TODO: ADD MONEY RAISED CALL FOR EACH SELECTED CHARITY

    CharityAPI.getAll()
      .success(function(data, status, headers, config){

        console.log("API call getAll succeeded");

        $scope.charities = [];
        var pastCharities = $scope.charityHistoryCall();
        console.log('pastCharities: ' + $scope.pastCharities);
        console.log('pastCharitiesMoneyRaised: ' + $scope.pastCharitiesMoneyRaised);


        for(var i = 0; i < data.length; i++){
          $scope.charities.push(data[i]);
        }



      })
      .error(function(err,status){
        console.log("Error retrieving charities");
        $rootScope.hide();
        $rootScope.notify("Something went wrong retrieving the list of charities");
        $rootScope.verifyStatus(status);
      });


    $scope.getSelectedCharityMoneySplits = function(charityNameString){
      //TODO: ADD DATE FOR MONTH MONEY DETERMINANT
      $scope.selectedCharityTotalMoneyRaised = 0;
      $scope.selectedCharityMonthMoneyRaised  = 0;
      HistoryAPI.getCharityHistory($rootScope.getUserId(), charityNameString)
        .success(function(cData, status, headers, config){
          console.log('charityNameString, History API success: ' + charityNameString);
          for(var i=0; i< cData.length; i++){
            console.log('cData[i].charity:  ' + cData[i].charity);
            if(charityNameString = cData[i].charity){
              console.log('charityNameString and cData['+i+'] matched with: ' + charityNameString + ' ' + cData[i].charity);
              $scope.selectedCharityTotalMoneyRaised = $scope.selectedCharityTotalMoneyRaised + cData[i].moneyRaised;

              console.log('cData['+i+'].month: ' + cData[i].month);
              if(charityMonth = cData[i].month){
                console.log('charityMonth and cData['+i+'] matched with: ' + charityMonth + ' ' + cData[i].month);
                $scope.selectedCharityMonthMoneyRaised = $scope.selectedCharityMonthMoneyRaised +  cData[i].moneyRaised;
              }
            }
          }

          $scope.displaySelectedTotalMoneyRaised = $scope.selectedCharityTotalMoneyRaised;
          console.log('$scope.displaySelectedTotalMoneyRaised: ' + $scope.displaySelectedTotalMoneyRaised);
          $scope.displaySelectedCharityMonthMoneyRaised = $scope.selectedCharityMonthMoneyRaised;
          console.log('$scope.displaySelectedCharityMonthMoneyRaised: ' + $scope.displaySelectedCharityMonthMoneyRaised);
        })
        .error(function(err){
          console.log('getCharityHistory API call failure');
        });

    }




    $scope.selectCharity = function(charityName){

      var email = $rootScope.getEmail();
      console.log('email: ' + email);
      console.log('charity: ' + charityName);
      var charityNameString = charityName.toString();
      console.log('charityNameString:' +charityNameString);
      $rootScope.removeSelectedCharityName();
      $scope.getSelectedCharityMoneySplits(charityNameString);

      var today = new Date();
      console.log('today: ' + today);
      var todaySplitter = today.toString().split(' ');
      var charityMonth =  todaySplitter[1];
      console.log('charityMonth: ' + charityMonth);


      $scope.pastCharity = [];

      //var newCharity = charity.toString();

      console.log($rootScope.getUserId());
      CharityAPI.selectCharity($rootScope.getUserId(), {charityName: charityNameString})
        .success(function(data, status, headers, config){
          console.log('charityNameString from API success: ' + charityNameString);
          $scope.charityName = charityNameString;

          $rootScope.setSelectedCharityName(charityNameString);
          console.log('charity: ' + $rootScope.getSelectedCharity());
          console.log('attempting to update user\'s selected charity');
          console.log('inside select charityAPI success');
          //$window.location.href=('#/app/run');
          console.log('charity API succeeded in selecting charity');

          console.log('charityNameString: ' + charityNameString);
          console.log('user id: ' + $rootScope.getUserId());





        })
        .error(function(err,status){
          console.log(err);
          console.log('inside select charityAPI failure');
          $rootScope.notify('Error selecting charity');
          $rootScope.verifyStatus(status);
        });
    }
  })


  // .controller('UploadController', function ($scope){
  //   var imageUpload = new ImageUpload();
  //   $scope.file = {};
  //   $scope.upload = function() {
  //     imageUpload.push($scope.file, function(data){
  //       console.log('File uploaded Successfully', $scope.file, data);
  //       $scope.uploadUri = data.url;
  //       $scope.$digest();
  //     });
  //   };
  // })

  .controller('createCharityCtrl', function($rootScope, CharityAPI, $ionicModal, $window, $scope, AuthAPI){
    $scope.charity = {
      name: "",
      description: "",
      url: "",
      avatar:""
    };

    $scope.createCharity = function(){
      var name = this.charity.name;
      var description = this.charity.description;
      var url = this.charity.url;
      var avatar = this.charity.avatar;

      $rootScope.show("Please wait... Creating Charity");

      var form  = {
        name: name,
        description: description,
        url: url,
        //user: $rootScope.getToken(),
        avatar: avatar,
        created: Date.now(),
        updated: Date.now()
      }

      CharityAPI.saveCharity(form)
        .success(function(data, status, headers, config){
          $rootScope.hide();
          //$rootScope.doRefresh(1);
          $window.location.href = ('#/app/charities');
        })
        .error(function(err, status){
          $rootScope.hide();
          $rootScope.notify("Error" + err);
          $rootScope.verifyStatus(status);
        });
    };
  })


  .controller('MyDonationCtrl',function($rootScope, $scope, $filter, $window, $ionicModal, $cordovaSms, $cordovaSocialSharing,DonationAPI,AuthAPI, CLIENT_HOST){


    $rootScope.$on('initial', function(){
        console.log("---------start donation ctrl initial---------");
        $scope.username = $rootScope.getName();
        $scope.avatar = $rootScope.getAvatar();
        console.log("---------end donation ctrl initial---------");
    });

    $rootScope.$on('destroy', function(){
        console.log("---------start donation ctrl destroy---------");
        $scope.username = undefined;
        $scope.avatar = undefined;
        console.log("---------end donation ctrl destroy---------");
    });

    $rootScope.$broadcast('initial');

    $scope.managePledges = function() {
      $rootScope.$broadcast('fetchMyPledges');
      $window.location.href = "#/app/myPledges";
    }

    $scope.manageSponsors = function() {
      $rootScope.$broadcast('fetchMySponsors');
      $window.location.href = "#/app/mySponsors";
    }

    $scope.doRefresh = function(fetchType) {
      console.log("fetchType:" + fetchType);
      $rootScope.$broadcast(fetchType);
    }

    $scope.formateDate = function(date) {
      return $filter('date')(date,"MMM dd yyyy");
    }

    $scope.formateCurreny = function(amount) {
      var realAmount = parseInt(amount);

      if(realAmount < 100) {
        return amount + " ¢";
      } else {
        return realAmount / 100 + " $";
      }

    }

    $ionicModal.fromTemplateUrl('templates/inviteSponsor.html',{
      scope: $scope
    }).then(function(modal){
      $scope.modal = modal;
    });

    $scope.openModal = function($event) {
      console.log("try open the modal");
      DonationAPI.inviteSponsor({
        // charity:"5771430bdcba0f275f2a0a5e",
        // userId:"577525799f1f51030075a291"
        //might have to cast these to strings?
        charity: $rootScope.getSelectedCharityId(),
        userId: $rootScope.getUserId()
      }).success(function (data, status, headers, config){
        $scope.inviteUrl = CLIENT_HOST + "#/app/inviteSponsor/start?id=" + data.code;
        console.log("local data:" + $scope.inviteUrl);
        // $scope.shareBySMS = function() {
        //   console.log("sms share begin")
        //   $cordovaSocialSharing.shareViaSMS("aaaaa", "0612345678,0687654321").then(function(result) {
        //       console.log("sms share success");
        //     }, function(err) {
        //       console.log("sms share failure");
        //   });
        // }
        $scope.shareByMail = function() {
          console.log("email share begin")
          $cordovaSocialSharing.shareViaEmail("aaa", "bbb", "", "", "", "").then(function(result) {
            console.log("email share success");
          }, function(err) {
            console.log("email share failure");
          });
        }

        $scope.shareBySMS = function(){
          console.log("begin share by sms");
          $cordovaSms.send("", "Pledge link: " + data)
            .then(function() {
              console.log('share sms success');
            }, function(error) {
              console.log('share sms failure');
              console.log(error);
            });
        }

        $scope.shareByFB = function() {
          console.log("begin share by facebook");
          $cordovaSocialSharing.shareViaFacebook(data, null, data).then(function(result) {
            console.log('share facebook success');
          }, function(err) {
            console.log('share facebook failure');
            console.log(err);
          });
        }


      }).error(function (err, status){
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
        $rootScope.verifyStatus(status);
      });
      $scope.modal.show($event);
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

    $scope.$on('modal.hidden',function(){
      console.log("execute modal.hidden");
    });

    $scope.$on('modal.removed', function(){
      console.log("execute modal.removed");
    });

  })

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
    }


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
    }

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


  .controller('HistoryDayCtrl', function($scope, $rootScope, $window, HistoryAPI){
  //Can't get pagination to show
  $scope.slideOptions = {
    pagination: true,
    paginationType: 'bullets'
  };

  $scope.back = function(){
    $window.location.href = ('#/app/history');
  }



  $scope.dayRuns = [];
  // $scope.dayLapsForm = [{
  //   number: String,
  //   distance: String,
  //   time: String,
  //   pace: String
  // }];

  $scope.dayMonthFormatter = function(monthSplit){
    switch(monthSplit){
      case "Jan":
        dayMonth = "January";
        return dayMonth;
        break;
      case "Feb":
        dayMonth = "Febuary";
        return dayMonth;
        break;
      case "Mar":
        dayMonth = "March";
        return dayMonth;
        break;
      case "Apr":
        dayMonth = "April";
        return dayMonth;
        break;
      case "May":
        dayMonth = "May";
        return dayMonth;
        break;
      case "Jun":
        dayMonth = "June";
        return dayMonth;
        break;
      case "Jul":
        dayMonth = "July";
        return dayMonth;
        break;
      case "Aug":
        dayMonth = "August";
        return dayMonth;
        break;
      case "Sep":
        dayMonth = "September";
        return dayMonth;
        break;
      case "Oct":
        dayMonth = "October";
        return dayMonth;
        break;
      case "Nov":
        dayMonth = "November";
        return dayMonth;
        break;
      case "Dec":
        dayMonth = "December";
        return dayMonth;
        break;
      default:
        dayMonth = "";
        return dayMonth;
        break;
    }
  };


  $scope.dayDateFormatter = function(daySplit){
    switch(daySplit) {
      case "01":
        dayDate: "1";
        return dayDate;
      case "02":
        dayDate: "2";
        return dayDate;
      case "03":
        dayDate: "3";
        return dayDate;
      case "04":
        dayDate: "4";
        return dayDate;
      case "05":
        dayDate: "5";
        return dayDate;
      case "06":
        dayDate: "6";
        return dayDate;
      case "07":
        dayDate: "7";
        return dayDate;
      case "08":
        dayDate: "8";
        return dayDate;
      case "09":
        dayDate: "9";
        return dayDate;
      default:
        return daySplit;
    }
  };

  $scope.distancePopHolder  = [];
  $scope.durationPopHolder = [];
  $scope.pacePopHolder = [];
  $scope.moneyRaisedPopHolder = [];
  $scope.pathPopHolder = [];
  $scope.lapsPopHolder = [];


  $scope.selectedRunNumber = 1;
  $rootScope.setValuesForHistoryDayView = function(date, distance, duration, pace, moneyRaised, path, laps, numberOfRuns){


    console.log('setValuesForHistoryDayView: date: ' + date);
    console.log('setValuesForHistoryDayView: date.length: ' + date.length);
    console.log('setValuesForHistoryDayView: number of runs: ' + numberOfRuns);
    $scope.dayUnformattedDisplayDate = date;
    $scope.dayDisplayDistance = distance;
    $scope.dayDisplayDuration = duration;
    $scope.dayDisplayPace = pace;
    $scope.dayDisplayMoneyRaised = moneyRaised;
    $scope.dayDisplayPath = path;
    $scope.dayDisplayLaps = laps;

    $scope.displayTotalNumberOfRuns = numberOfRuns;
    console.log('display total number of runs set as: ' + $scope.displayTotalNumberOfRuns);


    console.log('dayDisplayDistance values: ' + $scope.dayDisplayDistance);


    var dayDatesplit = $scope.dayUnformattedDisplayDate.toString().split(' ');
    var monthSplit = dayDatesplit[0];
    var daySplit = dayDatesplit[1];
    var yearSplit = dayDatesplit[2];




    console.log('date split for history day view: month: ' + monthSplit + ' daysplit' + daySplit + ' year: ' + yearSplit);

    var dayMonth = $scope.dayMonthFormatter(monthSplit);
    console.log('dayMonth: '+ dayMonth);
    var dayDate =  $scope.dayDateFormatter(daySplit);
    console.log('dayDate: '+ dayDate);
    $scope.dayDisplayDate = dayMonth + ' ' + dayDate + ', ' + yearSplit;

    for(x=0; x< numberOfRuns; x ++){

      console.log('setValuesForHistoryDayView: path: ' + path);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayForPath : ' + $scope.dayDisplayPath);
      console.log('setValuesForHistoryDayView: path.lat: ' + path.lat);
      console.log('setValuesForHistoryDayView: path.long: '+ path.long);
      console.log('setValuesForHistoryDayView: $scope.displayForPath.lat : ' + $scope.dayDisplayPath[x].lat);
      console.log('setValuesForHistoryDayView: $scope.displayForPath.long: ' +$scope.dayDisplayPath[x].long);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps: ' + $scope.dayDisplayLaps);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.number: ' + $scope.dayDisplayLaps[x].number);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.number.length: ' + $scope.dayDisplayLaps[x].number.length);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.distance: ' + $scope.dayDisplayLaps[x].distance);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.seconds: ' + $scope.dayDisplayLaps[x].seconds);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.minutes: ' + $scope.dayDisplayLaps[x].minutes);
      console.log('setValuesForHistoryDayView: $scope.dayDisplayLaps.pace: ' + $scope.dayDisplayLaps[x].pace);
    }


    $scope.setRunValues = function(runNumber){
      //split differently -> lap all one object, lap in laps, lap.number
      var x = runNumber -1;
      console.log('entered setRunValues with runNumber: ' + runNumber);

      $scope.historyPolyCoords = [];

      $scope.dayLapsForm = [{
        number: String,
        distance: String,
        time: String,
        pace: String
      }];



      $scope.runDisplayDuration = $scope.dayDisplayDuration[x];
      console.log('runDisplayDuration set as: ' + $scope.runDisplayDuration);
      $scope.runDisplayDistance = $scope.dayDisplayDistance[x];
      console.log('runDisplayDistance set as: ' + $scope.runDisplayDistance);
      $scope.runDisplayPace = $scope.dayDisplayPace[x];
      console.log('runDisplayPace set as: ' + $scope.runDisplayPace);
      $scope.runDisplayMoneyRaised = $scope.dayDisplayMoneyRaised[x];
      console.log('runDisplayMoneyRaised set as: ' + $scope.runDisplayMoneyRaised);
      $scope.runDisplayPath = $scope.dayDisplayPath[x];
      console.log('runDisplayMoneyRaised set as: ' + $scope.runDisplayPath);

      console.log('setValuesForHistoryDayView: $scope.dayDisplayPath.lat.length: ' + $scope.dayDisplayPath[x].lat.length);
      var latSplit = $scope.runDisplayPath.lat.toString().split(',');
      var longSplit = $scope.runDisplayPath.long.toString().split(',');
      console.log('setValuesForHistoryDayView: latSplit: ' + latSplit[x]);
      console.log('setValuesForHistoryDayView: latSplit.length: ' + latSplit.length);
      console.log('setValuesForHistoryDayView: longSplit: ' + longSplit[x]);


      //string splitter for laps
      var lapNumberSplit = $scope.dayDisplayLaps[x].number.toString().split(',');
      var lapDistancesSplit = $scope.dayDisplayLaps[x].distance.toString().split(',');
      var lapSecondsSplit = $scope.dayDisplayLaps[x].seconds.toString().split(',');
      var lapMinutesSplit = $scope.dayDisplayLaps[x].minutes.toString().split(',');
      var lapPaceSplit = $scope.dayDisplayLaps[x].pace.toString().split(',');

      lapNumberSplit.shift();
      lapDistancesSplit.shift();
      lapSecondsSplit.shift();
      lapMinutesSplit.shift();
      lapPaceSplit.shift();

      for (var i = 0; i < lapNumberSplit.length; i++) {
        console.log('setValuesForHistoryDayView: lapNumberSplit['+i+']: ' + lapNumberSplit[i]);
        console.log('setValuesForHistoryDayView: lapDistancesSplit['+i+']: ' + lapDistancesSplit[i]);
        console.log('setValuesForHistoryDayView: lapSecondsSplit['+i+']: ' + lapSecondsSplit[i]);
        console.log('setValuesForHistoryDayView: lapMinutesSplit['+i+']: ' + lapMinutesSplit[i]);
        console.log('setValuesForHistoryDayView: lapPaceSplit['+i+']: ' + lapPaceSplit[i]);

        var time = lapMinutesSplit[i] + ':' + lapSecondsSplit[i];
        console.log('time: '+ time);

        $scope.dayLapsForm.push( {number: lapNumberSplit[i], distance: lapDistancesSplit[i],
          time: time,  pace: lapPaceSplit[i]});
        console.log('setValuesForHistoryDayView: $scope.dayLaps: ' + $scope.dayLapsForm);
        console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.dayLapsForm);

      }

      console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.dayLapsForm.length);
      //
      // $scope.distancePopHolder  = [];
      // $scope.durationPopHolder = [];
      // $scope.pacePopHolder = [];
      // $scope.moneyRaisedPopHolder = [];
      // $scope.pathPopHolder = [];
      // $scope.lapsPopHolder = [];


      if(latSplit.length == longSplit.length){
        for(var i=0; i< latSplit.length; i++){
          var latCoord = latSplit[i];
          console.log('setValuesForHistoryDayView: latCoord : ' + latCoord);
          var longCoord = longSplit[i];
          console.log('setValuesForHistoryDayView: longCoord : ' + longCoord);
          var LatLng = new google.maps.LatLng(latCoord, longCoord);
          console.log('setValuesForHistoryDayView: LatLng : ' + LatLng);
          $scope.historyPolyCoords.push(LatLng);
          console.log('setValuesForHistoryDayView: $scope.historyPolycoords: ' + $scope.historyPolyCoords);

        }
        $scope.historyRunPath = new google.maps.Polyline({
          path: $scope.historyPolyCoords,
          strokeColor: '#ff0000',
          strokeOpacity: 1.0,
          strokeWeight: 8
        });
        $scope.historyRunPath.setMap($scope.map);

      } else {
        $rootScope.notify("Lat,Lng lengths do not match");
        console.log('setValuesForHistoryDayView: lat,long lengths do not match');
      }

    }


    $scope.setRunValues($scope.selectedRunNumber);
    console.log('setRunValues called with run number: ' + $scope.selectedRunNumber+ ' on page load' );




    $scope.incrementRunNumber = function(){
      console.log('incrementRunNumber function called');
      if ($scope.selectedRunNumber < numberOfRuns){
        console.log('selectedRunNumber": ' + $scope.selectedRunNumber);
        $scope.selectedRunNumber++;
        console.log('incremented selectedRunNumber: ' + $scope.selectedRunNumber);
        $scope.historyRunPath.setPath([]);
        $scope.setRunValues($scope.selectedRunNumber);
      }
      console.log('incremented selectedRunNumber: ' + $scope.selectedRunNumber);
    }
    $scope.decrementRunNumber = function(){
      console.log('decrementRunNumber function called');
      if ($scope.selectedRunNumber >1){
        console.log('selectedRunNumber": ' + $scope.selectedRunNumber);
        $scope.selectedRunNumber =  $scope.selectedRunNumber-1;
        console.log('decremented selectedRunNumber: ' + $scope.selectedRunNumber);
        $scope.historyRunPath.setPath([]);
        $scope.setRunValues($scope.selectedRunNumber);
      }
      console.log('decremented selectedRunNumber: ' + $scope.selectedRunNumber);
    }





  }







  $scope.mapCreated = function(map){
    $scope.map = map;
    $scope.mapOptions = map.setOptions({
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    // console.log('setValuesForHistoryDayView: mapCreate path values: ' + $scope.dayDisplayPath);
    // $scope.runPath = new google.maps.Polyline({
    //   path: $scope.dayDisplayPath
    // });

  }



})

  .controller('HistoryListCtrl', function ($scope, $rootScope, $window) {



  })

  .controller('HistoryCtrl', function($scope, $rootScope, $window, HistoryAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout) {

    $scope.viewHistory = function(){

      $window.location.href = ('#/app/historyList');
    };


    //progress bar
    $scope.getColor = function(){
      return '#00b9be';
    }

    $scope.maxDayDistance = 1;
    $scope.currentDayDistance = 1;

    $scope.maxDayFunds = 1;
    $scope.currentDayFunds= .3;

    $scope.maxWeekDistance = 63;
    $scope.currentWeekDistance = 35;

    $scope.maxWeekFunds =100;
    $scope.currentWeekFunds= 130;


    //D3 testing
    $scope.salesData = [
      {hour: 1,sales: 54},
      {hour: 2,sales: 66},
      {hour: 3,sales: 77},
      {hour: 4,sales: 70},
      {hour: 5,sales: 60},
      {hour: 6,sales: 63},
      {hour: 7,sales: 55},
      {hour: 8,sales: 47},
      {hour: 9,sales: 55},
      {hour: 10,sales: 30}
    ];


    //SLIDER PROPERTIES
    $scope.slideOptions = {
      pagination: true,
      loop: false
    };


    $scope.colors = [{
      fillColor: "#00b9be",
      strokeColor: "#00b9be",
      highlightStroke: "rgb(206, 29, 31)",
      highlightFill: "rgb(206, 29, 31)"
    }];

    $scope.options = {
      legend: {
        display: false,
        position: "left",
        labels: {
          display: true,
          fontFamily: "Helvetica Neue",
          boxWidth: 0,
        }
      },

      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 2
          },

          scaleLabel: {
            display: true,
            labelString: "Miles",
            fontFamily: "Helvetica Neue",
            fontSize: "16"
          }
        }],

        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    };
    //
    $scope.onClick = function(bar, evt){
      console.log(bar, evt);
      console.log('bar['+0+']: ' + [bar[0].label]);
      $scope.matchLabelToDay([bar[0].label]);


    };



    var t = Date.now();
    var today = new Date(t);
    //
    // console.log('Today: ' +today );
    // var utcToday= new Date(today.toUTCString());
    // console.log('Today: ' + today + ' Converts to UTC string: ' + utcToday);
    // var isoToday = new Date(today.toISOString());
    // console.log('Today: ' + today + 'Converts to Iso string: ' + isoToday);
    var todaySplit = today.toString().split(' ');
    var todayMonth = todaySplit[1];
    console.log('Today month: '  + todayMonth);

    //for get runs by month api call
    $scope.distances = [];
    $scope.dates = [];
    // $scope.formattedDatesWithTime = [];
    $scope.formattedDates = [];
    $scope.seconds = [];
    $scope.minutes = [];
    $scope.paces = [];
    $scope.moneyRaised = [];
    $scope.paths = [];
    $scope.laps = [];
    //for weekViews
    $scope.weekDates = [];
    $scope.dayOneDateNonDisplayHolder;
    $scope.dayTwoDateNonDisplayHolder;
    $scope.dayThreeDateNonDisplayHolder;
    $scope.dayFourDateNonDisplayHolder;
    $scope.dayFiveDateNonDisplayHolder;
    $scope.daySixDateNonDisplayHolder;
    $scope.daySevenDateNonDisplayHolder;

    //month stuff
    $scope.setMonthTotalDistance = function(distances){
      $scope.monthTotalDistance;
      var distanceSum = 0;
      console.log('Distances.length: ' + distances.length);
       for(var i= 0; i<distances.length; i++){
         distanceSum = distanceSum +  distances[i];
         console.log('monthTotal distance calculation: ' + distanceSum);
       }
       $scope.monthTotalDistance = distanceSum;
       console.log('$scope.setMonthTotalDistance returning a total distance value of: ' + $scope.monthTotalDistance);
       return $scope.monthTotalDistance;
    }

    $scope.setMonthAveragePace = function(paces){
      $scope.monthAveragePace;
       var paceSum = 0;
      console.log('Paces.length: ' + paces.length);
      for(var i = 0; i< paces.length; i++){
        paceSum = paceSum + paces[i];
        console.log('value of paces at i : ' + paces[i]);
        console.log('$scope.monthPaceSum calculation: ' + paceSum);
      }
      $scope.monthAveragePace = paceSum / paces.length;
      console.log('$scope.monthAveragePace: ' + $scope.monthAveragePace);
      console.log('$scope.setMonthAveragePace returning an average pace of: ' + $scope.monthAveragePace);
      return $scope.monthAveragePace;
    }

    $scope.setMonthTotalMoneyRaised = function(moneyRaised){
      $scope.monthTotalMoneyRaised;
      var moneyTotalSum = 0;
      console.log('Distances.length: ' + moneyRaised.length);
      for(var i= 0; i<moneyRaised.length; i++){
        moneyTotalSum =+  moneyTotalSum +moneyRaised[i];
        console.log('$scope.monthTotal distance calculation: ' + moneyTotalSum);
      }
      $scope.monthTotalMoneyRaised = moneyTotalSum;
      console.log('$scope.setMonthTotalMoneyRaised returning a total distance value of: ' + $scope.monthTotalMoneyRaised);
      return $scope.monthTotalMoneyRaised;
    }

    $scope.getNumberOfRuns = function(date){
      var counter = 0;
      for (var i=0; i< $scope.formattedDates.length; i++){
        if(date = $scope.formattedDates[i]){
          counter++;
          console.log('get number of runs counter: ' + counter);
        }
      }
      console.log('final count for number of runs: ' + counter);
      return counter;
    }

    // $rootScope.$on('fetchMonthHistory', function(){
      HistoryAPI.getByMonth($rootScope.getUserId(), todayMonth)
        .success(function(data, status, headers, config) {
          console.log('HistoryAPI getByMonth successfully called');
          for (var i = 0; i < data.length; i++) {
            $scope.distances.push(data[i].distance);
            console.log('$scope.distances[i]: ' + $scope.distances[i]);
            // console.log('$scope.distances: ' + $scope.distances);


            $scope.dates.push(data[i].date);
            console.log('$scope.dates: ' + $scope.dates[i]);

            $scope.seconds.push(data[i].seconds);
            console.log('$scope.seconds: ' + $scope.seconds);

            $scope.minutes.push(data[i].minutes);
            console.log('$scope.minutes: ' + $scope.minutes);

            $scope.paces.push(data[i].pace);
            console.log('$scope.pace: '+ $scope.paces);

            $scope.moneyRaised.push(data[i].moneyRaised);
            console.log('$scope.moneyRaised: ' + $scope.moneyRaised);


            $scope.paths.push(data[i].path);
            console.log('$scope.paths: ' + $scope.paths);
            console.log('$scope.paths['+i+'].lat: ' + $scope.paths[i].lat);
            console.log('$scope.paths['+i+'].long: ' + $scope.paths[i].long);
            // for(var x=0; x<$scope.paths.length; x++){
            //   console.log('$scope.paths['+x+'].lat: ' + $scope.paths[x].lat);
            //   console.log('$scope.paths['+x+'].long: ' + $scope.paths[x].long);
            //   console.log('$scope.paths.long: ' + $scope.paths.long);
            //   console.log('$scope.paths.lat: ' + $scope.paths.lat);
            // }
            $scope.laps.push(data[i].laps);
            console.log('$scope.laps: ' + $scope.laps);
            console.log('$scope.laps['+i+'].number: ' + $scope.laps[i].number);


            var formattedDatesWithTime = $scope.dates[i];
            console.log('formattedDatesWithTime: ' + formattedDatesWithTime);
            var formattedSplitDate1 = formattedDatesWithTime.toString().split('T');
            console.log('formattedSplitDate: ' + formattedSplitDate1);
            var formattedSplitDate2 = formattedSplitDate1.toString().split('-');
            console.log('formattedSplitDate2: ' + formattedSplitDate2);

            var tempFormattedDate = formattedSplitDate2[2].toString().split(',');
            var formattedDate = tempFormattedDate[0];
            var tempFormattedMonth = formattedSplitDate2[1];
            var formattedYear = formattedSplitDate2[0];
            var formattedTime = tempFormattedDate[1];
            var formattedMonth = $scope.monthNumberToString(tempFormattedMonth);
            console.log('formatting of date returns: formattedDate: ' + formattedDate +
              ' formattedYear: ' +formattedYear   + 'tempFormattedMonth: ' + tempFormattedMonth
              + 'formattedMonth: ' + formattedMonth + 'formattedTime: ' + formattedTime);

            var finalFormattedDate = formattedMonth + ' ' +formattedDate + ' ' + formattedYear;
            console.log('finalFormattedDate: ' + finalFormattedDate);
            $scope.formattedDates.push(finalFormattedDate);
            console.log('$scope.formattedDates: ' + $scope.formattedDates);
          }

          console.log('Today value from inside HistoryAPI call: ' + today);
          $scope.getWeekDatesOnLoad();


          console.log('$scope.distanceslength: ' + $scope.distances.length + '$scope.dates.length: ' + $scope.dates.length);

          var thisMonthTotalDistance = $scope.setMonthTotalDistance($scope.distances);
          console.log('HistoryAPI getByMonth set total distance value as: ' + thisMonthTotalDistance);

          var thisMonthAveragePace = $scope.setMonthAveragePace($scope.paces);
          console.log('HistoryAPI getByMonth set average pace as: ' + thisMonthAveragePace);

          var thisMonthTotalMoneyRaised = $scope.setMonthTotalMoneyRaised($scope.moneyRaised);
          console.log('HistoryAPI getByMonth set total money raised value as: ' + thisMonthTotalMoneyRaised);

          console.log('$scope.dates.length: ' + $scope.dates.length);



          // for(var i=0; i< $scope.dates.length; i++){
          //   var dateHolder = new Date($scope.dates[i]);
          //   console.log('dateHolder: ' + dateHolder);
          //   var dateFormatHolder = new Date(dateHolder.toISOString());
          //   console.log('dateFormatHolder: ' + dateFormatHolder);
          //   $scope.formattedDatesWithTime.push(dateFormatHolder);
          //   console.log('formattedDatesWithTime[i]: ' + $scope.formattedDatesWithTime[i]);
          //   console.log('formattedDatesWithTime: ' + $scope.formattedDatesWithTime);
          // }



        })
        .error(function(err,status){
          console.log('HistoryAPI getBYMonth returned error: ' + err);
          $rootScope.verifyStatus(status);
        });
    // })



    //week stuff
    $scope.startDate;
    $scope.endDate;

    $scope.monthNumberToString = function(month){
      switch(month){
        case "01":
          monthString = "Jan";
          return monthString;
          break;
        case "02":
          monthString = "Feb";
          return monthString;
          break;
        case "03":
          monthString = "Mar";
          return monthString;
          break;
        case "04":
          monthString = "Apr";
          return monthString;
          break;
        case "05":
          monthString = "May";
          return monthString;
          break;
        case "06":
          monthString = "Jun";
          return monthString;
          break;
        case "07":
          monthString = "Jul";
          return monthString;
          break;
        case "08":
          monthString = "Aug";
          return monthString;
          break;
        case "09":
          monthString = "Sep";
          return monthString;
          break;
        case "10":
          monthString = "Oct";
          return monthString;
          break;
        case "11":
          monthString = "Nov";
          return monthString;
          break;
        case "12":
          monthString = "Dec";
          return monthString;
          break;
        default:
          console.log('could not match month number' + month + ' to string')
          break;
      }
    };

    $scope.monthToNumber = function(month){
      switch(month){
        case "Jan":
          monthNumber = 01;
          return monthNumber;
          break;
        case "Feb":
          monthNumber = 02;
          return monthNumber;
          break;
        case "Mar":
          monthNumber = 03;
          return monthNumber;
          break;
        case "Apr":
          monthNumber = 04;
          return monthNumber;
          break;
        case "May":
          monthNumber = 05;
          return monthNumber;
          break;
        case "Jun":
          monthNumber = 06;
          return monthNumber;
          break;
        case "Jul":
          monthNumber = 07;
          return monthNumber;
          break;
        case "Aug":
          monthNumber = 08;
          return monthNumber;
          break;
        case "Sep":
          monthNumber = 09;
          return monthNumber;
          break;
        case "Oct":
          monthNumber = 10;
          return monthNumber;
          break;
        case "Nov":
          monthNumber = 11;
          return monthNumber;
          break;
        case "Dec":
          monthNumber = 12;
          return monthNumber;
          break;
        default:
          monthNumber = 0;
          return monthNumber;
          break;
      }
    };

    $scope.parseDisplayDatesForWeek = function(startDate, endDate){
      console.log('startDate: ' + startDate + ' endDate: ' + endDate );
      var endParserHolder = new Date(endDate);
      var startParserHolder = new Date(startDate);
      var endparser = endParserHolder.toString().split(' ');
      var startparser = startParserHolder.toString().split(' ');
      console.log('endParserHolder: ' + endParserHolder + ' parser : ' + endparser);
      console.log('parserHolder: ' + startParserHolder + ' parser : ' + startparser);

      $scope.displayDayArray = [];
      var thisEndMonth = endparser[1];
      var thisEndDay = endparser[2];
      var thisStartMonth = startparser[1];
      var thisStartDay = startparser[2];
      var monthNumber = $scope.monthToNumber(thisStartMonth);
      console.log('thisEndMonth: ' + thisEndMonth + ' thisEndDay: ' + thisEndDay);
      console.log('thisStartMonth: ' + monthNumber + ' thisStartDay: ' + thisStartDay);
      var thisDay = thisStartDay;
      for(var i=0; i<6; i++){
        thisDay++;
        console.log('thisDay: ' + i + '  ' + thisDay);
        $scope.displayDayArray[i] = thisDay;
      }

      console.log('$scope.displayDayArray[3]: ' + $scope.displayDayArray[3]);

      //day one is the startDate
      $scope.displayDayOne = monthNumber + '/' + thisStartDay;
      $scope.displayDayTwo = monthNumber + '/' + $scope.displayDayArray[0];
      $scope.displayDayThree = monthNumber + '/' + $scope.displayDayArray[1];
      $scope.displayDayFour = monthNumber + '/' + $scope.displayDayArray[2];
      $scope.displayDayFive = monthNumber + '/' + $scope.displayDayArray[3];
      $scope.displayDaySix = monthNumber + '/' + $scope.displayDayArray[4];
      $scope.displayDaySeven = monthNumber + '/' + thisEndDay;

      console.log('$scope.displayDayFive: ' + $scope.displayDayFive);
      console.log('parseDatesForWeekDisplay ' + $scope.displayDayOne + ' ' + $scope.displayDayTwo + ' ' +
        $scope.displayDayThree + ' ' + $scope.displayDayFour + ' ' + $scope.displayDayFive + ' ' +
        $scope.displayDaySix + ' ' + $scope.displayDaySeven);


      $scope.labels = [$scope.displayDayOne,  $scope.displayDayTwo,
        $scope.displayDayThree, $scope.displayDayFour,
        $scope.displayDayFive, $scope.displayDaySix, $scope.displayDaySeven];

      // return $scope.displayDayOne,  $scope.displayDayTwo,
      //   $scope.displayDayThree, $scope.displayDayFour,
      //   $scope.displayDayFive, $scope.displayDaySix, $scope.displayDaySeven;

    }



    $scope.parseDatesForMatch = function(date){
      console.log('parseDatesForMatch called with parameters: ' + date);
      var tempDate = new Date(date);
      var splitTempDate = tempDate.toString().split(' ');
      console.log('splitTempDate: ' + splitTempDate);
      var weekDay = splitTempDate[0];
      console.log('weekDate from parseDatesForMatch: ' + weekDay);
      var month = splitTempDate[1];
      console.log('monthDate from parseDatesForMatch: ' + month);
      var d = splitTempDate[2];
      console.log('date from parseDatesForMatch: ' + d);
      var year = splitTempDate[3];
      console.log('year from parseDatesForMatch: ' + year);
      var dateForMatch = month.toString() + ' ' + d.toString() + ' ' + year.toString();
      console.log('parseDatesForMatch returns value of: ' + dateForMatch);
      return dateForMatch;
    }

    $scope.parseJSONDatesForMatch = function(date){
      var tempDate = new Date(date);
      console.log('tempdate from parseJSONDates for match: ' + tempDate);
      tempDate.setDate(tempDate.getDate());
      console.log('tempdate from parseJSONDates for match: ' + tempDate);
      var splitTempDate1 = tempDate.toString().split('T');
      console.log('splitTempDate from parseJSONDatesForMatch: ' + splitTempDate1);
      var splitTempDate2 = splitTempDate1.toString().split('-')
      console.log('splitTempDate from parseJSONDatesForMatch: ' + splitTempDate2);
      var tempYear = splitTempDate2[0];
      var tempMonth = splitTempDate2[1];
      var tempDate = splitTempDate2[2];
      // var month =
    }


    $scope.matchWeekValues = function(dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven){
      console.log('match week values called with params: ' + dayOne + ' '+ dayTwo+ ' '
        + dayThree + ' ' + dayFour+ ' ' + dayFive+ ' ' +daySix+ ' day seven: ' +daySeven);
      console.log('matchWeekValues: $scope.dates: ' +$scope.dates);
      console.log('matchWeekValues: $scope.dates.length: ' + $scope.dates.length);
      console.log('matchWeekValues: $scope.formattedDates: ' +$scope.formattedDates);
      console.log('matchWeekValues: $scope.formattedDates.length: ' + $scope.formattedDates.length);

      console.log('matchWeekValues: $scope.fo')

      var tempDayOneHolder = 0;
      var tempDayTwoHolder = 0;
      var tempDayThreeHolder = 0;
      var tempDayFourHolder = 0;
      var tempDayFiveHolder = 0;
      var tempDaySixHolder = 0;
      var tempDaySevenHolder = 0;

      var counterOne =  0;
      var counterTwo = 0;
      var counterThree =  0;
      var counterFour =  0;
      var counterFive = 0;
      var counterSix =  0;
      var counterSeven =  0;



      // var counterOne =  $scope.getNumberOfRuns(dayOne);
      // console.log('number of Runs: counterOne ' + counterOne);
      // var counterTwo = $scope.getNumberOfRuns(dayTwo);
      // console.log('number of Runs: counterTwo ' + counterTwo);
      // var counterThree =  $scope.getNumberOfRuns(dayThree);
      // console.log('number of Runs: counterThree ' + counterThree);
      // var counterFour =  $scope.getNumberOfRuns(dayFour);
      // console.log('number of Runs: counterFour ' + counterFour);
      // var counterFive =  $scope.getNumberOfRuns(dayFive);
      // console.log('number of Runs: counterFive ' + counterFive);
      // var counterSix =  $scope.getNumberOfRuns(daySix);
      // console.log('number of Runs: counterSix ' + counterSix);
      // var counterSeven =  $scope.getNumberOfRuns(daySeven);
      // console.log('number of Runs: counterSeven ' + counterSeven);



      for(var i=0; i< $scope.formattedDates.length; i++){

        console.log('matchWeekValues: $scope.formattedDates[i]: ' + $scope.formattedDates[i]);

        if(dayOne == $scope.formattedDates[i]){
          console.log('dayOne matched with datesArrayFormatter at day: ' + dayOne + ' ' + $scope.formattedDates[i]);
          tempDayOneHolder = tempDayOneHolder + $scope.distances[i];
          console.log('$scope.distances[i] (dayOne): ' + $scope.distances[i]);
          console.log('tempDayOneHolder: ' + tempDayOneHolder);
          counterOne++;
          console.log('counterOne: ' + counterOne);
          // return $scope.dayOneDistance;
        } else if(dayTwo == $scope.formattedDates[i]){
          console.log('dayTwo matched with datesArrayFormatter at day: ' + dayTwo + ' ' + $scope.formattedDates[i]);
          tempDayTwoHolder = tempDayTwoHolder + $scope.distances[i];
          console.log('$scope.distances[i] (dayTwo): ' + $scope.distances[i]);
          console.log('tempDayTwoHolder: ' + tempDayTwoHolder);
          counterTwo++;
          console.log('counterTwo: ' + counterTwo);
          // return $scope.dayTwoDistance;

        } else if(dayThree == $scope.formattedDates[i]){
          console.log('dayThree matched with datesArrayFormatter at day: ' + dayThree + ' ' + $scope.formattedDates[i]);
          tempDayThreeHolder = tempDayThreeHolder + $scope.distances[i];
          console.log('$scope.distances[i] (dayThree): ' + $scope.distances[i]);
          console.log('tempDayThreeHolder: ' + tempDayThreeHolder);
          counterThree++;
          console.log('counterThree: ' + counterThree);
          // return $scope.dayThreeDistance;
        }

        else if(dayFour == $scope.formattedDates[i]){
          console.log('dayFour matched with datesArrayFormatter at day: ' + dayFour + ' ' + $scope.formattedDates[i]);
          tempDayFourHolder = tempDayFourHolder + $scope.distances[i];
          console.log('$scope.distances[i] (tempDayFourHolder): ' + $scope.distances[i]);
          console.log('tempDayFourHolder: ' + tempDayFourHolder);
          counterFour++;
          console.log('counterFour: ' + counterFour);
          // return $scope.dayFourDistance;
        }

        else if(dayFive == $scope.formattedDates[i]){
          console.log('dayFive matched with datesArrayFormatter at day: ' + dayFive + ' ' + $scope.formattedDates[i]);
          tempDayFiveHolder = tempDayFiveHolder + $scope.distances[i];
          console.log('$scope.distances[i] (dayFive): ' + $scope.distances[i]);
          console.log('tempDayFiveHolder: ' + tempDayFiveHolder);
          counterFive++;
          console.log('counterFive: ' + counterFive);
          // return $scope.dayFiveDistance;
        }

        else if(daySix == $scope.formattedDates[i]){
          console.log('daySix matched with datesArrayFormatter at day: ' + daySix + ' ' + $scope.formattedDates[i]);
          tempDaySixHolder = tempDaySixHolder + $scope.distances[i];
          console.log('matchWeekValues: $scope.distances[i] (daySix): ' + $scope.distances[i]);
          console.log('$tempDaySixHolder ' + tempDaySixHolder);
          counterSix++;
          console.log('counterSix: ' + counterSix);
          // return $scope.daySixDistance;
        }

        else if(daySeven == $scope.formattedDates[i]){
          console.log('daySeven matched with datesArrayFormatter at day: ' + daySeven + ' ' + $scope.formattedDates[i]);
          tempDaySevenHolder = tempDaySevenHolder + $scope.distances[i];
          console.log('matchWeekValues: $scope.distances[i] (daySeven): ' + $scope.distances[i]);
          console.log('tempDaySevenHolder: ' + tempDaySevenHolder);
          counterSeven++;
          console.log('counterSeven: ' + counterSeven);
          // return $scope.daySevenDistance;
        } else {
          console.log('matchWeekValues: Did not match date: ' + $scope.formattedDates[i] + ' to any of this weeks dates' );
        }



      }
      console.log('counterFive final: ' + counterFive);


      $scope.dayOneDistance = tempDayOneHolder;
      console.log('$scope.dayOneDistance: ' + $scope.dayOneDistance);
      $scope.dayTwoDistance = tempDayTwoHolder;
      console.log('$scope.dayTwoDistance: ' + $scope.dayTwoDistance);
      $scope.dayThreeDistance = tempDayThreeHolder;
      console.log('$scope.dayThreeDistance: ' + $scope.dayThreeDistance);
      $scope.dayFourDistance = tempDayFourHolder;
      console.log('$scope.dayFourDistance: ' + $scope.dayFourDistance);
      $scope.dayFiveDistance = tempDayFiveHolder;
      console.log('$scope.dayFiveDistance: ' + $scope.dayFiveDistance);
      $scope.daySixDistance = tempDaySixHolder;
      console.log('matchWeekValues:$scope.daySixDistance: ' + $scope.daySixDistance);
      $scope.daySevenDistance = tempDaySevenHolder;
      console.log('matchWeekValues:  $scope.daySevenDistance: ' + $scope.daySevenDistance);

      $scope.data = [[$scope.dayOneDistance, $scope.dayTwoDistance, $scope.dayThreeDistance,
        $scope.dayFourDistance, $scope.dayFiveDistance, $scope.daySixDistance,
        $scope.daySevenDistance]];




    }


    //sets values for day to pass to historyDayCtrl
    $scope.setDayValues = function(date){
      console.log('Entered setDayValues function with date value: ' + date);
      console.log('setDayValues: $scope.formattedDates: ' + $scope.formattedDates);
      console.log('setDayValues: $scope.formattedDates.length: ' + $scope.formattedDates.length);

      $scope.thisDateRunDistance = [];
      $scope.thisDateRunDuration = [];
      $scope.thisDateRunPace = [];
      $scope.thisDateRunMoneyRaised = [];
      $scope.thisDateRunLaps = [];
      $scope.thisDateRunPath = [];

      var counter = 0;





      for(var i =0; i<$scope.formattedDates.length; i++){

        if(date == $scope.formattedDates[i]){
          // console.log('setDayValues: Date and datesArrayFormatter matched with values of :' + date + ' ' + datesArrayFormatter);
          // console.log('setDayValues: number of runs on ' + date + ': ' + counter);
          // counter++;

          console.log('setDayValues: Date and $scope.formatteddates[i] matched with values: ' + $scope.formattedDates[i] + ' ' + date);
          console.log('setDayValues: $scope.distances[i]: ' + $scope.distances[i]);
          $scope.thisDateRunDistance.push($scope.distances[i]);
          console.log('setDayValues: $scope.thisRunDistance: ' + $scope.thisDateRunDistance);
          // var thisRunDateCoords = [];


          console.log('setDayValues: $scope.minutes[i]: ' + $scope.minutes[i] + ' $scope.seconds[i]' + $scope.seconds[i]);
          if($scope.seconds[i] < 10){
            // $scope.thisDateRunDuration = $scope.minutes[i] + ':0' + $scope.seconds[i];
            $scope.thisDateRunDuration.push($scope.minutes[i] + ':0' + $scope.seconds[i]);
            console.log('setDayValues: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
          } else {
            $scope.thisDateRunDuration.push($scope.minutes[i] + ':' + $scope.seconds[i]);
            console.log('setDayValues: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
          }

          //

          console.log('setDayValues: $scope.pace: ' + $scope.paces[i]);
          $scope.thisDateRunPace.push($scope.paces[i]);
          console.log('setDayValues: $scope.thisDateRunPace: ' + $scope.thisDateRunPace);

          console.log('setDayValues: $scope.moneyRaised: ' + $scope.moneyRaised[i]);
          $scope.thisDateRunMoneyRaised.push($scope.moneyRaised[i]);
          console.log('setDayValues: $scope.thisDateRunMoneyRaised: ' + $scope.thisDateRunMoneyRaised);

          console.log('setDayValues: $scope.paths: ' + $scope.paths[i]);
          $scope.thisDateRunPath.push($scope.paths[i]);
          console.log('setDayValues: $scope.thisDateRunPath: ' + $scope.thisDateRunPath);

          console.log('setDayValues: $scope.laps['+i+']: ' + $scope.laps[i]);
          $scope.thisDateRunLaps.push($scope.laps[i]);
          console.log('setDayValues: $scope.thisDateRunLaps: ' + $scope.thisDateRunLaps);
          counter++;
        }


      }

      $window.location.href = ('#/app/historyDay');
      $rootScope.setValuesForHistoryDayView(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
        $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
        $scope.thisDateRunPath, $scope.thisDateRunLaps, counter);

    }

    $scope.getWeekDatesForValuesMatch = function(startDate){
      console.log('getWeekDatesForValuesMatch called with param: ' + startDate);
      var dayOne = new Date(startDate);
      // dayOne.setDate(dayOne.getDate() - 6);
      console.log('getWeekDatesForValuesMatch: dayOne date pre time removal: ' + dayOne);

      var dayTwo = new Date(dayOne);
      dayTwo.setDate(dayTwo.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: dayTwo date: ' + dayTwo);


      var dayThree = new Date(dayTwo);
      dayThree.setDate(dayThree.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: dayThree date: ' + dayThree);

      var dayFour = new Date(dayThree);
      dayFour.setDate(dayFour.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: dayFour date: ' + dayFour);

      var dayFive = new Date(dayFour);
      dayFive.setDate(dayFive.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: dayFive date: ' + dayFive);

      var daySix = new Date(dayFive);
      daySix.setDate(daySix.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: daySix date: ' + daySix);

      var daySeven = new Date(daySix);
      daySeven.setDate(daySeven.getDate() + 1);
      console.log('getWeekDatesForValuesMatch: daySeven date: ' + daySeven);

      dayOne = $scope.parseDatesForMatch(dayOne);
      console.log('getWeekDatesForValuesMatch: dayOne after time removal: ' + dayOne);

      dayTwo = $scope.parseDatesForMatch(dayTwo);
      console.log('getWeekDatesForValuesMatch: dayTwo after time removal: ' + dayTwo);

      dayThree = $scope.parseDatesForMatch(dayThree);
      console.log('getWeekDatesForValuesMatch: dayThree after time removal: ' + dayThree);

      dayFour = $scope.parseDatesForMatch(dayFour);
      console.log('getWeekDatesForValuesMatchday: Four after time removal: ' + dayFour);

      dayFive = $scope.parseDatesForMatch(dayFive);
      console.log('getWeekDatesForValuesMatchday: Five after time removal: ' + dayFive);

      daySix = $scope.parseDatesForMatch(daySix);
      console.log('getWeekDatesForValuesMatch: daySix after time removal: ' + daySix);

      daySeven = $scope.parseDatesForMatch(daySeven);
      console.log('getWeekDatesForValuesMatch: daySeven after time removal: ' + daySeven);




      $scope.matchWeekValues(dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven);

      $scope.dayOneDateNonDisplayHolder = dayOne;
      $scope.dayTwoDateNonDisplayHolder = dayTwo;
      $scope.dayThreeDateNonDisplayHolder = dayThree;
      $scope.dayFourDateNonDisplayHolder = dayFour;
      $scope.dayFiveDateNonDisplayHolder = dayFive;
      $scope.daySixDateNonDisplayHolder = daySix;
      $scope.daySevenDateNonDisplayHolder = daySeven;

      console.log('Date holders = ' +    $scope.dayOneDateNonDisplayHolder +
        $scope.dayTwoDateNonDisplayHolder +
        $scope.dayThreeDateNonDisplayHolder +
        $scope.dayFourDateNonDisplayHolder +
        $scope.dayFiveDateNonDisplayHolder +
        $scope.daySixDateNonDisplayHolder +
        $scope.daySevenDateNonDisplayHolder);

    }




    $scope.getWeekDatesOnLoad = function(){
      var today = Date.now();
      console.log('today: ' + today);
      $scope.endDate = new Date(today);
      console.log('end date: ' + $scope.endDate);
      var newDate = new Date($scope.endDate);
      newDate.setDate(newDate.getDate() - 6);
      $scope.startDate = new Date(newDate);

      console.log('$scope.startDate from getWeekDatesOnLoad: ' + $scope.startDate);
      console.log('$scope.endDate from getWeekDatesOnLoad: ' + $scope.endDate);
      $scope.parseDisplayDatesForWeek($scope.startDate, $scope.endDate);
      $scope.getWeekDatesForValuesMatch($scope.startDate);
      return $scope.startDate, $scope.endDate;
    }


    $scope.getWeekDatesOnDecrement = function(){
      console.log('getWeekDatesOnDecrement entered, $scope.startDate value of: ' + $scope.startDate);
      var newEndDate = new Date($scope.startDate);
      console.log('newEndDate initialized with value of: ' + newEndDate);
      newEndDate.setDate(newEndDate.getDate() -1);
      console.log('newEndDate decremented, value set as: ' + newEndDate);
      $scope.endDate  = new Date(newEndDate);
      console.log('$scope.endDate set as : ' + $scope.endDate + ' from $scope.getWeekDatesOnDecrement');
      var newStartDate = new Date(newEndDate);
      console.log('newEndDate initialized with value of: ' + newStartDate);
      newStartDate.setDate(newStartDate.getDate() -6);
      console.log('newStart date decremented with value of: ' + newStartDate);
      $scope.startDate = new Date(newStartDate);
      console.log('$scope.startDate set as: ' + $scope.startDate + ' from $scope.startDate');
      $scope.parseDisplayDatesForWeek($scope.startDate, $scope.endDate);
      $scope.getWeekDatesForValuesMatch($scope.startDate);
      return $scope.startDate, $scope.endDate;
    }

    $scope.getWeekDatesOnIncrement = function(){
      var newStartDate = new Date($scope.endDate);
      console.log('newEndDate initialized with value of: ' + newStartDate);
      newStartDate.setDate(newStartDate.getDate() +1);
      console.log('newStart date decremented with value of: ' + newStartDate);
      $scope.startDate = new Date(newStartDate);
      console.log('getWeekDatesOnDecrement entered, $scope.startDate value of: ' + $scope.startDate);

      var newEndDate = new Date($scope.startDate);
      console.log('newEndDate initialized with value of: ' + newEndDate);
      newEndDate.setDate(newStartDate.getDate() +6);
      console.log('newEndDate decremented, value set as: ' + newEndDate);
      $scope.endDate  = new Date(newEndDate);
      console.log('$scope.endDate set as : ' + $scope.endDate + ' from $scope.getWeekDatesOnDecrement');

      $scope.parseDisplayDatesForWeek($scope.startDate, $scope.endDate);
      $scope.getWeekDatesForValuesMatch($scope.startDate);
      return $scope.startDate, $scope.endDate;
    }


    $scope.matchLabelToDay = function(label){
      console.log('matchLabelToDay function called with params: ' + label);
      console.log('Date holders from matchLabel to date= ' +    $scope.dayOneDateNonDisplayHolder +
        $scope.dayTwoDateNonDisplayHolder +
        $scope.dayThreeDateNonDisplayHolder +
        $scope.dayFourDateNonDisplayHolder +
        $scope.dayFiveDateNonDisplayHolder +
        $scope.daySixDateNonDisplayHolder +
        $scope.daySevenDateNonDisplayHolder);

      console.log('displayLabels from matchLabel: ' + $scope.displayDayOne + ' ' + $scope.displayDayTwo + ' ' +
        $scope.displayDayThree + ' ' + $scope.displayDayFour + ' ' + $scope.displayDayFive + ' ' +
        $scope.displayDaySix + ' ' + $scope.displayDaySeven);

      if(label == $scope.displayDayOne){
        console.log('Label matched day one display with values: ' + label + ' ' + $scope.displayDayOne);
        $scope.setDayValues($scope.dayTwoDateNonDisplayHolder);

      }
      else if(label == $scope.displayDayTwo){
        console.log('Label matched day two display with values: ' + label + ' ' + $scope.displayDayTwo);
        $scope.setDayValues($scope.dayTwoDateNonDisplayHolder);
      }
      else if(label == $scope.displayDayThree){
        console.log('Label matched day three display with values: ' + label + ' ' + $scope.displayDayThree);
        $scope.setDayValues($scope.dayThreeDateNonDisplayHolder);
      }
      else if(label == $scope.displayDayFour){
        console.log('Label matched day four display with values: ' + label + ' ' + $scope.displayDayFour);
        $scope.setDayValues($scope.dayFourDateNonDisplayHolder);
      }
      else if(label == $scope.displayDayFive){
        console.log('Label matched day five display with values: ' + label + ' ' + $scope.displayDayFive);
        $scope.setDayValues($scope.dayFiveDateNonDisplayHolder);
      }
      else if(label == $scope.displayDaySix){
        console.log('Label matched day six display with values: ' + label + ' ' + $scope.displayDaySix);
        $scope.setDayValues($scope.daySixDateNonDisplayHolder);
      }
      else if(label == $scope.displayDaySeven){
        console.log('Label matched day seven display with values: ' + label + ' ' + $scope.displayDaySeven);
        $scope.setDayValues($scope.daySevenDateNonDisplayHolder);
      } else {
        console.log('Error: Could not match dates');
      }

    }


    // $scope.series = ['Series A'];
  })

  .controller('RacesCtrl', function($scope) {

  })

  .controller('MyRacesCtrl', function($scope) {

  })

  .controller('FindRacesCtrl', function($scope) {

  })

  .controller('PastRacesCtrl', function($scope) {


  });
