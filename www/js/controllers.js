angular.module('starter.controllers', ['starter.appServices',
    'starter.charityServices',
    'starter.authServices',
    'starter.runServices',
    'starter.donationServices',
    'starter.userServices',

    'starter.historyServices',

    'starter.runServices','ionic','ngCordova','ngOpenFB', 'chart.js'])


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
          var name =data.name.first + data.name.last;
          console.log('name: ' + name);

          $rootScope.setName(name);

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
        .error(function(err){
          console.log('CharityAPI.getOne failed with error: ' + err);
          console.log('Could not retrieve charity information');
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
          var firstName = data.name.first;
          var lastName = data.name.last;

          $scope.user.name = firstName + ' ' + lastName;
          console.log('$scope.name set as: ' + $scope.user.name);
          $rootScope.setName($scope.user.name);
          console.log('user name localStorage set to: ' + $rootScope.getName());

          $scope.user.password = data.password;
          console.log('$scope.user.password set as: ' + $scope.user.password);
          $rootScope.setPassword($scope.user.password);

          $scope.user.email = data.email;
          console.log('$scope.user.email set to: ' + $scope.user.email);
          $rootScope.setEmail($scope.user.email);
          console.log('Email set as: ' + $rootScope.getEmail());

          $scope.user.created = data.created;
          console.log('$scope.user.created set as: ' + $scope.user.created);
          $rootScope.setCreatedAt($scope.user.created);
          console.log('createdAt local storage set: ' + $rootScope.getCreatedAt());

          $scope.user.id = data._id;
          console.log('$scope.user.id set to: ' + $scope.user.id);
          $rootScope.setUserId($scope.user.id);
          console.log('User id local storage set: ' + $rootScope.getUserId());


          // console.log(data.charityName);
          if(data.charityName == undefined){
            $scope.noCharity = true;
          } else {
            $scope.setUserCharity(data.charityName);
          }



          // $scope.user.charityName = data.charityName;
          // console.log('Charity: ' + $scope.user.charity);
          // $scope.setUserCharity($scope.user.charityName);

          // $scope.user.charityId = data.charityId;
          // console.log('$scope.user.charityId set as: ' + $scope.user.charityId);
          // $rootScope.setSelectedCharity($scope.user.charityId);
          // console.log('selectedCharity local storage set: ' + $rootScope.getSelectedCharity());

          $rootScope.hide();

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
              $rootScope.setUserId(data._id);
              console.log('User id: ' + $rootScope.getUserId());
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
                $rootScope.setUserId(data._id);
                $rootScope.setEmail(data.email);
                console.log('User email: ' + $rootScope.getEmail());
                console.log('User id: ' + $rootScope.getUserId());
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

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $interval, RunAPI, CharityAPI, $ionicPopup,  AuthAPI){
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

    $scope.charityName = $rootScope.getSelectedCharityName();
    console.log('Run charityName: ' + $scope.charityName);

    $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();
    console.log('$scope.moneyRaised: ' + $scope.moneyRaised);


    $scope.user.name = $rootScope.getName();

    $scope.isDetailDisplayed = false;
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
      lapUI.style.marginBottom = '25px';
      lapUI.style.textAlign = 'center';
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
      resumeUI.style.marginBottom = '25px';
      resumeUI.style.textAlign = 'center';
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
              type: 'button-positive',
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

      // var welcomeControlDiv = document.createElement('div');
      // var welcomeControl = $scope.welcomeControl(welcomeControlDiv, map);
      //
      // welcomeControlDiv.index = 1;
      // map.controls[google.maps.ControlPosition.TOP].push(welcomeControlDiv);

      var startControlDiv = document.createElement('div');
      var startControl = $scope.startControl(startControlDiv, map);


      startControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(startControlDiv);

    };

    $scope.startRun  = function(){
      console.log('%cStarting run...', 'color: HotPink');


      console.log("%cAttempting to remove start button...", 'color: HotPink');
      $scope.removeStartUI();


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
      console.log('%c$scope.stopTimer() called', 'color: RoyalBlue');
      $scope.stopTimer();
      $scope.stopLapTimer();
      $scope.stopRunDistance();
      $scope.stopLapDistance();
      $scope.stopPaceCalculator();
      $scope.stopLapPaceCalculator();
      var runSummaryButtonControlDiv = document.createElement('div');
      var runSummaryButtonControl = $scope.summaryButtonControl(runSummaryButtonControlDiv, $scope.map);

      runSummaryButtonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(runSummaryButtonControlDiv);
    }



    $scope.postRun = function(){

      console.log('Push run- Distance: '+ $rootScope.getRunDistance());
      console.log('Push run- minutes: ' + $rootScope.getRunMinutes());
      console.log('Push run-  Seconds: ' + $rootScope.getRunSeconds());
      console.log('Push run-  Pace: ' + $rootScope.getRunPace());
      console.log('Push run-  User: ' + $rootScope.getUserId());
      console.log('Push run- Path: ' + $rootScope.getRunPath());
      console.log('Push run- Money raised amount: ' + $rootScope.getRunMoneyRaisedAmount());


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
        seconds: $rootScope.getRunSeconds(),
        minutes: $rootScope.getRunMinutes(),
        pace: $rootScope.getRunPace(),
        User: $rootScope.getUserId(),
        moneyRaised: $rootScope.getRunMoneyRaisedAmount(),
        lapNumber: $scope.pushLapNumbers,
        lapDistance: $scope.pushLapDistances,
        lapSeconds:  $scope.pushLapSeconds,
        lapMinutes:  $scope.pushLapMinutes,
        lapPace:  $scope.pushLapPace,
        path: [{lat: $scope.lat}, {long: $scope.long}],
        date: Date.now()
      }
      console.log('Form Distance: ' + form.distance);
      console.log('Form.lapDistance: ' + form.lapDistance);
      console.log('Run save form: ' + form);

      RunAPI.saveRun(form)
        .success(function(data, status, headers, config){
          //just status header for now
          console.log('saveRun API call returned success');

        })
        .error(function(err){
          console.log(err);
          console.log('Save run API call failed');
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

  .controller('AppCtrl', function($rootScope, $scope, $filter, $ionicModal, $timeout, DonationAPI, CharityAPI) {
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
      DonationAPI.getAllSponsors($rootScope.getToken(),
        "577525799f1f51030075a291"
      )
        .success(function(data, status, headers, config){
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

      }).error(function(data, status, headers, config){
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });

    $rootScope.$on('fetchMyPledges',function(){
      DonationAPI.getAllPledges($rootScope.getToken(),"577525799f1f51030075a292").success(function(data, status, headers, config){
        $scope.pledges = [];
        for (var i = 0; i < data.length; i++) {
          $scope.pledges.push(data[i]);
        };

        if(data.length == 0) {
          $scope.noPledge = true;
        } else {
          $scope.noPledge = false;
        }

      }).error(function(data, status, headers, config){
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });


    //move fetches to Services
    // $rootScope.$on('fetchAccountInfo', function(){
    //   $scope.user = {
    //     email: $rootScope.getEmail(),
    //     selectedCharity: "",
    //     firstName: "",
    //     lastName: "",
    //     dob: ""
    //   };
    //
    //   var email  =  $rootScope.getEmail();
    //   console.log('fetching account information with email: ' + email);
    //   var token = $rootScope.getToken();
    //   console.log('fetching account information with token: ' + token);
    //
    //   UserAPI.getOne(email, token)
    //     .success(function(data, status, headers, config){
    //       console.log('entered User.getOne success call');
    //
    //       $scope.user.selectedCharity = data.selectedCharity;
    //       console.log('UserAPI call returned selected charity value of : ' + $scope.user.selectedCharity);
    //
    //       $scope.user.firstName = data.firstName;
    //       console.log('User firstname set: ' + $scope.user.firstName );
    //
    //       $scope.user.lastName = data.lastName;
    //       console.log('User last name set: ' + $scope.user.lastName);
    //
    //       $scope.user.dob = data.dob;
    //       console.log('User dob set as: ' + $scope.user.dob);
    //
    //       //rootScope for account info global variables. what do we need here?
    //       //set selectedCharityId
    //
    //
    //     })
    // })
    //
    // $rootScope.$on('fetchCharityInformation', function(){
    //   $scope.charity = {
    //     name: "",
    //     description: "",
    //     avatar: ""
    //   };
    //
    //
    // })

  })



  .controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, AuthAPI){

    $scope.isDetailDisplayed = false;
    $scope.charityName  = $rootScope.getSelectedCharityName();
    $scope.charityDescription = $rootScope.getSelectedCharityDescription();
    $scope.charityAvatar = $rootScope.getSelectedCharityAvatar();
    $scope.charityUrl = $rootScope.getSelectedCharityUrl();

    console.log('$rootScope.getSelectedCharityName: ' + $rootScope.getSelectedCharityName());

    // $rootScope.$on('fetchSelectedCharity', function(){
    //   //TODO: FETCH, SERVER FOR USER SELECTED CHARITY, UI FOR ID PARAMS
    //   CharityAPI.getSelectedCharity()
    // });

    $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();

    if($scope.charityName == undefined){
      $scope.noCharity = true;
      console.log('noCharityValue: ' + $scope.noCharity);
    }

    CharityAPI.getAll()
      .success(function(data, status, headers, config){

        console.log("API call getAll succeeded");

        $scope.charities = [];

        for(var i = 0; i < data.length; i++){
          $scope.charities.push(data[i]);
        }

      })
      .error(function(err){
        $rootScope.hide();
        $rootScope.notify("Something went wrong retrieving the list of charities");
        console.log("Error retrieving charities");
      });


    $scope.selectCharity = function(charityName){

      var email = $rootScope.getEmail();
      console.log('email: ' + email);
      console.log('charity: ' + charityName);
      var charityNameString = charityName.toString();
      $rootScope.setSelectedCharity(charityNameString);




      //var newCharity = charity.toString();

      console.log($rootScope.getUserId());
      CharityAPI.selectCharity($rootScope.getUserId(), {charityName: charityNameString})
        .success(function(data, status, headers, config){
          console.log('charity: ' + $rootScope.getSelectedCharity());
          console.log('attempting to update user\'s selected charity');
          console.log('inside select charityAPI success');
          //$window.location.href=('#/app/run');
          console.log('charity API succeeded in selecting charity');
        })
        .error(function(err){
          console.log(err);
          console.log('inside select charityAPI failure');
          $rootScope.notify('Error selecting charity');
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

  .controller('createCharityCtrl', function($rootScope, CharityAPI, $ionicModal, $window, $scope){
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
        .error(function(data, status, headers, config, err){
          $rootScope.hide();
          $rootScope.notify("Error" + err);
        });
    };
  })

  .controller('MyDonationCtrl',function($rootScope, $scope, $filter, $window, $ionicModal, $cordovaSms, $cordovaSocialSharing,DonationAPI){

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
      DonationAPI.inviteSponsor("token",{
        // charity:"5771430bdcba0f275f2a0a5e",
        // userId:"577525799f1f51030075a291"
        //might have to cast these to strings?
        charity: $rootScope.getSelectedCharityId(),
        userId: $rootScope.getUserId()
      }).success(function (data, status, headers, config){
        $scope.data = data;
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


      }).error(function (data, status, headers,config){
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
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



  .controller('MyPledgesCtrl',function($rootScope, $scope, $filter, $window, DonationAPI){


  })

  .controller('InviteSponsorInfoCtrl', function($rootScope, $scope, $http, store, $window){
    $scope.user = {
      firstname: "",
      lastname: ""
    };
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

    $scope.setActive = function (type) {
      $scope.active = type;
    };
    $scope.isActive = function (type) {
      return type === $scope.active;
    };

  })
  .controller('MyPledgesCtrl', function($rootScope, $scope, $filter, DonationAPI) {
    // $scope.doRefresh = function() {
    DonationAPI.getAllPledges($rootScope.getToken(), "577525799f1f51030075a292")
      .success(function (data, status, headers, config) {
        $scope.list = [];
        for (var i = 0; i < data.length; i++) {
          data[i].end_date = $filter('date')(data[i].end_date, "MMM dd yyyy");
          $scope.list.push(data[i]);
        }
        ;

        $scope.donor = {
          amount: ""
        };

        $scope.saveMoney = function () {

          var amount = this.donor.amount;

          if (!amount && $scope.active == 'zero') {
            return false;
          }
          if (amount != '') {
            store.set('donor.amount', amount);
          }
          $window.location.href = ('#/app/inviteSponsor/pledge');
        }

        $scope.saveMoneyWithAmount = function (amount) {
          store.set('donor.amount', amount);
        }

      })
  })

  .controller('MyPledgesCtrl', function($rootScope, $scope, $filter, DonationAPI) {

  })

  .controller('InviteSponsorPledgeCtrl', function($scope, $http, store, $window){

    $scope.active = 'zero';
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

  .controller('InviteSponsorStartCtrl', function($scope){

  })

  .controller('InviteSponsorPaymentCtrl', function($rootScope, $scope, $http, store, DonationAPI, $window){
    $scope.user = {
      email: ""
    };
    $scope.updateDonation = function(status, response) {

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
          userId: '576d5555765c85f11c7f0ca1'
        }).success(function (data){
          $window.location.href = ('#/app/inviteSponsor/end');
        }).error(function (err){
          console.log("error: " + err.message);
        });
      }
    }
  })


  // Do the first time when page loaded
  // $scope.doRefresh();

  .controller('InviteSponsorEndCtrl', function($scope, $http, store){
    $scope.months = store.get('donor.months');
    $scope.amount = store.get('donor.amount');
  })

  .controller('AccountCtrl', function($rootScope, AuthAPI, UserAPI, $window, $scope) {
    //refresh on page load?
    //Profile Picture - edit
    //Name- cannot edit
    //Email -edit
    //Password (hashed)
    //DOB-cannot edit

    //password should redirect to new page to enter old password/ could have dropdown?



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

        .error(function (error) {
          if (error.error && error.error.code == 11000) {
            $rootScope.notify("This email is already in use");
            console.log("could not register user: email already in use ");
          } else {
            $rootScope.notify("An error has occured. Please try again");
          }
        });
    }
  })





  .controller('HistoryCtrl', function($scope, $rootScope, HistoryAPI, AuthAPI, $filter) {

    //Angular-nvd3 Chart Configuation
    $scope.options = {
        chart: {
            type: 'historicalBarChart',
            height: 300,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 50
            },
            x: function(d){return d[0];},
            y: function(d){return d[1]/100000;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.1f')(d);
            },
            duration: 100,
            xAxis: {
                // axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%m/%d')(new Date(d))
                },
                rotateLabels: 0,
                showMaxMin: false
            },
            yAxis: {
                // axisLabel: 'Y Axis',
                axisLabelDistance: -10,
                tickFormat: function(d){
                    return d3.format(',.1f')(d);
                }
            },
            tooltip: {
                keyFormatter: function(d) {
                    return d3.time.format('%x')(new Date(d));
                }
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: true,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            }
        }
    };

    $scope.data = [
        {
            "key" : "Quantity" ,
            "bar": true,
            "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
        }];


    /*Angular-chart Chart Configuration*/
    //
    // $scope.rData = [];
    //
    //
    // $scope.options = {
    //   legend: {
    //     display: false,
    //     position: "left",
    //     labels: {
    //       fontFamily: "Helvetica Neue",
    //       boxWidth: 0
    //     }
    //   },
    //
    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true,
    //         stepSize: 2,
    //       },
    //
    //       scaleLabel: {
    //         display: true,
    //         labelString: "Miles",
    //         fontFamily: "Helvetica Neue",
    //         fontSize: "16"
    //       }
    //     }],
    //
    //     xAxes: [{
    //       gridLines: {
    //         display: false
    //       }
    //     }]
    //   }
    // };
    //
    // $scope.onClick = function (bar, evt) {
    //   console.log(bar, evt);
    //   if (bar[0] != null) {
    //     console.log("Bar with value " + $scope.data[0][bar[0]._index] + " clicked");
    //   }
    // };
    /*CHART NOTE
    It is very easy to display the bar chart. The labels array is for the days and the data array is for the miles for those days
    End Chart Configuration
     */

    $scope.januaryRunDates = [];
    $scope.februaryRunDates = [];
    $scope.marchRunDates = [];
    $scope.aprilRunDates = [];
    $scope.mayRunDates = [];
    $scope.juneRunDates = [];
    $scope.julyRunDates = [];
    $scope.augustRunDates = [];
    $scope.septemberRunDates = [];
    $scope.octoberRunDates = [];
    $scope.novemberRunDates = [];
    $scope.decemberRunDates = [];

    $scope.januaryRunDistances = [];
    $scope.februaryRunDistances = [];
    $scope.marchRunDistances = [];
    $scope.aprilRunDistances = [];
    $scope.mayRunDistances = [];
    $scope.juneRunDistances= [];
    $scope.julyRunDistances = [];
    $scope.augustRunDistances = [];
    $scope.septemberRunDistances = [];
    $scope.octoberRunDistances = [];
    $scope.novemberRunDistances = [];
    $scope.decemberRunDistances = [];

    $scope.januaryRunPaces = [];
    $scope.februaryRunPaces= [];
    $scope.marchRunPaces= [];
    $scope.aprilRunPaces= [];
    $scope.mayRunPaces= [];
    $scope.juneRunPaces= [];
    $scope.julyRunPaces= [];
    $scope.augustRunPaces= [];
    $scope.septemberRunPaces= [];
    $scope.octoberRunPaces= [];
    $scope.novemberRunPaces= [];
    $scope.decemberRunPaces= [];

    $scope.januaryMoneyRaised = [];
    $scope.februaryMoneyRaised = [];
    $scope.marchMoneyRaiseds = [];
    $scope.aprilMoneyRaised = [];
    $scope.mayMoneyRaised = [];
    $scope.juneMoneyRaised = [];
    $scope.julyMoneyRaised = [];
    $scope.augustMoneyRaised = [];
    $scope.septemberMoneyRaised = [];
    $scope.octoberMoneyRaised = [];
    $scope.novemberMoneyRaised = [];
    $scope.decemberMoneyRaised = [];


    $scope.ids = [];
    $scope.dates = [];
    $scope.distances = [];
    $scope.seconds = [];
    $scope.minutes = [];
    $scope.paces = [];
    $scope.moneyRaised = [];
    $scope.days = [];
    $scope.years = []
    $scope.months = [];


    var t = Date.now();
    $scope.today  = new Date(t);
    console.log('Today: ' + $scope.today);

    $scope.isoMonthToNumber = function(month){
      switch(month){
        case "Jan":
          monthNumber = "01";
          return monthNumber;
        case "Feb":
          monthNumber = "02";
          return monthNumber;
        case "Mar":
          monthNumber = "03";
          return monthNumber;
        case "Apr":
          monthNumber = "04";
          return monthNumber;

        case "May":
          monthNumber = "05";
          return monthNumber;

        case "Jun":
          monthNumber = "06";
          return monthNumber;

        case "Jul":
          monthNumber = "07";
          return monthNumber;

        case "Aug":
          monthNumber = "08";
          return monthNumber;

        case "Sep":
          monthNumber = "09";
          return monthNumber;

        case "Oct":
          monthNumber = "10";
          return monthNumber;

        case "Nov":
          monthNumber = "11";
          return monthNumber;

        case "Dec":
          monthNumber = "12";
          return monthNumber;

        default:
          monthNumber = 0;
          return monthNumber;

      }
    };
    $scope.assignMonth = function(date){
      var splitOne = date.toString().split('/');
      console.log('Split One: ' + splitOne);

      var month = splitOne[0];
      console.log('Month:' + month);
      return month;

    }

    $scope.calculateMonthDistance = function(distance){
      $scope.sum = 0;
      for (var i = 0; i< distance.length; i++){
        $scope.sum =+ distance[i];
        console.log("Sum: " + $scope.sum);
        return $scope.sum;
      }
    }

    $scope.sumPace = function(pace){
      $scope.sum = 0;
      console.log('Pace.length from sumPace: ' + pace.length);
      console.log('Pace from sumPace: ' + pace);
      for(var i= 0; i<pace.length; i++){
        $scope.sum =+ pace[i];
        console.log('$scope.sum: ' + $scope.sum);

      }
      console.log('$scope.sum: ' + $scope.sum);
      return $scope.sum;
    };
    $scope.calculateMonthPace = function(pace){
      var sumPace = $scope.sumPace(pace);
      console.log('Sum pace set as: ' + sumPace);

      console.log('Pace.length: ' + pace.length);
      $scope.average = sumPace / pace.length;
      console.log('Average pace set as: ' + $scope.average);
      return $scope.average;
    }


    $scope.calculateTotalMoneyRaised = function(moneyRaised){
      $scope.mRaised = 0;
      console.log('Money raised length: ' +moneyRaised.length);
      for(var i = 0; i< moneyRaised.length; i++){
        $scope.mRaised =+ moneyRaised[i];
        console.log('$scope.mRaised: ' + $scope.mRaised);
      }
      console.log('$scope.mRaised: ' + $scope.mRaised);
      return $scope.mRaised;
    }
    $scope.setMonthValues = function(monthNumber, date, distance, seconds, minutes, pace, moneyRaised){
      console.log('monthNumber:' + monthNumber);
      console.log('date: ' + date);
      switch(monthNumber){
        case "01":
          $scope.januaryRunDates.push(date);
          $scope.januaryRunDistances.push(distance);
          $scope.januaryRunPaces.push(pace);
          $scope.januaryMoneyRaised.push(moneyRaised);
          console.log('januaryRunDates: ' + $scope.januaryRunDates);
          console.log('januaryRunDistances: ' + $scope.januaryRunDistances);
          console.log('januaryRunPaces: ' + $scope.januaryRunPaces);
          console.log('januaryMoneyRaised: ' + $scope.januaryMoneyRaised);
          return;
        case "02":
          $scope.februaryRunDates.push(date);
          $scope.februaryRunDistances.push(distance);
          $scope.februaryRunPaces.push(pace);
          $scope.februaryMoneyRaised.push(moneyRaised);
          console.log('februaryRunDates: ' + $scope.februaryRunDates);
          console.log('februaryRunDistances: ' + $scope.februaryRunDistances);
          console.log('februaryRunPaces: ' + $scope.februaryRunPaces);
          console.log('februaryMoneyRaised: ' + $scope.februaryMoneyRaised);
          return;
        case "03":
          $scope.marchRunDates.push(date);
          $scope.marchRunDistances.push(distance);
          $scope.marchRunPaces.push(pace);
          $scope.marchMoneyRaiseds.push(moneyRaised);
          console.log('marchRunDates: ' + $scope.marchRunDates);
          console.log('marchRunDistances: ' + $scope.marchRunDistances);
          console.log('marchRunPaces: ' + $scope.marchRunPaces);
          console.log('marchMoneyRaised: ' + $scope.marchMoneyRaised);
          return;
        case "04":
          $scope.aprilRunDates.push(date);
          $scope.aprilRunDistances.push(distance);
          $scope.aprilRunPaces.push(pace);
          $scope.aprilMoneyRaised.push(moneyRaised);

          console.log('aprilRunDates: ' + $scope.aprilRunDates);
          console.log('aprilRunDistances: ' + $scope.aprilRunDistances);
          console.log('aprilRunPaces: ' + $scope.aprilRunPaces);
          console.log('aprilMoneyRaised: ' + $scope.aprilMoneyRaised);
          return;
        case "05":
          $scope.mayRunDates.push(date);
          $scope.mayRunDistances.push(distance);
          $scope.mayRunPaces.push(pace);
          $scope.mayMoneyRaised.push(moneyRaised);
          console.log('mayRunDates: ' + $scope.mayRunDates);
          console.log('mayRunDistances: ' + $scope.mayRunDistances);
          console.log('mayRunPaces: ' + $scope.mayRunPaces);
          console.log('mayMoneyRaised: ' + $scope.mayMoneyRaised);
          return;
        case "06":
          $scope.juneRunDates.push(date);
          $scope.juneRunDistances.push(distance);
          $scope.juneRunPaces.push(pace);
          $scope.juneMoneyRaised.push(moneyRaised);
          console.log('juneRunDates: ' + $scope.juneRunDates);
          console.log('juneRunDistances: ' + $scope.juneRunDistances);
          console.log('juneRunPaces: ' + $scope.juneRunPaces);
          console.log('juneRunPaces: ' + $scope.juneMoneyRaised);
          return $scope.juneRunPaces;
        case "07":
          $scope.julyRunDates.push(date);
          $scope.julyRunDistances.push(distance);
          $scope.julyRunPaces.push(pace);
          $scope.julyMoneyRaised.push(moneyRaised);
          $scope.julyTotalDistance = $scope.calculateMonthDistance($scope.julyRunDistances);
          $scope.julyAveragePace = $scope.calculateMonthPace($scope.julyRunPaces);
          $scope.julyTotalMoneyRaised = $scope.calculateTotalMoneyRaised($scope.julyMoneyRaised);
          console.log('julyRunDates: ' + $scope.julyRunDates);
          console.log('julyRunDistances: ' + $scope.julyRunDistances);
          console.log('julyRunPaces: ' + $scope.julyRunPaces);
          console.log('julyMoneyRaised: ' + $scope.julyMoneyRaised);
          console.log('julyTotalDistanceRun: ' + $scope.julyTotalDistance);
          console.log('julyAveragePace: ' + $scope.julyAveragePace);
          console.log('julyTotalMoneyRaised: ' + $scope.julyTotalMoneyRaised);
          return;
        case "08":
          $scope.augustRunDates.push(date);
          $scope.augustRunDistances.push(distance);
          $scope.augustRunPaces.push(pace);
          $scope.augustMoneyRaised.push(moneyRaised);
          console.log('augustRunDates: ' + $scope.augustRunDates);
          console.log('augustRunDistances: ' + $scope.augustRunDistances);
          console.log('augustRunPaces: ' + $scope.augustRunPaces);
          console.log('augustMoneyRaised: ' + $scope.augustMoneyRaised);
          return;
        case "09":
          $scope.septemberRunDates.push(date);
          $scope.septemberRunDistances.push(distance);
          $scope.septemberRunPaces.push(pace);
          $scope.septemberMoneyRaised.push(moneyRaised);
          console.log('septemberRunDates: ' + $scope.septemberRunDates);
          console.log('septemberRunDistances: ' + $scope.septemberRunDistances);
          console.log('septemberRunPaces: ' + $scope.septemberRunPaces);
          console.log('septemberMoneyRaised: ' + $scope.septemberMoneyRaised);
          return;
        case "10":
          $scope.octoberRunDates.push(date);
          $scope.octoberRunDistances.push(distance);
          $scope.octoberRunPaces.push(pace);
          $scope.octoberMoneyRaised.push(moneyRaised);
          console.log('octoberRunDates: ' + $scope.octoberRunDates);
          console.log('octoberRunDistances: ' + $scope.octoberRunDistances);
          console.log('octoberMoneyRaised: ' + $scope.octoberMoneyRaised);
          console.log('octoberRunPaces: ' + $scope.octoberRunPaces);
          return;
        case "11":
          $scope.novemberRunDates.push(date);
          $scope.novemberRunDistances.push(distance);
          $scope.novemberRunPaces.push(pace);
          $scope.novemberMoneyRaised.push(moneyRaised);
          console.log('novemberRunDates: ' + $scope.novemberRunDates);
          console.log('novemberRunDistances: ' + $scope.novemberRunDistances);
          console.log('novemberRunPaces: ' + $scope.novemberRunPaces);
          console.log('novemberMoneyRaised: ' + $scope.novemberMoneyRaised);
          return;
        case "12":
          $scope.decemberRunDates.push(date);
          $scope.decemberRunDistances.push(distance);
          $scope.decemberRunPaces.push(pace);
          $scope.decemberMoneyRaised.push(moneyRaised);
          console.log('decemberRunPaces: ' + $scope.decemberRunPaces);
          console.log('decemberRunDates: ' + $scope.decemberRunDates);
          console.log('decemberRunDistances: ' + $scope.decemberRunDistances);
          console.log('decemberMoneyRaised: ' + $scope.decemberMoneyRaised);
          return;
        default:
          console.log('Error: date could not be logged');
          return;
      }
    }


    $scope.parseUTCDate = function(date){
      var split = date.toString().split('-');
      console.log('ParseUTCDate split: ' + split);
      var year = split[0];
      console.log('parseUTC year value: ' + year);
      var month = split[1];
      console.log('parseUTC month value: ' + month);
      var dayTime = split[2];
      var dayTimeSplit = dayTime.split('T');
      var day = dayTimeSplit[0];
      console.log('parseUTC day value: ' + day);

      var newDate = month + '/' + day + '/' + year;
      console.log('parseUTCDate returns: ' + newDate);

      return newDate;
    }


    //for the s
    $scope.parseISOdate = function(date){
      var split = date.toString().split(' ');
      console.log('ParseISODate split: ' + split);
      var year = split[3];
      console.log('parseISO year value: ' + year);
      var isoMonth = split[1];
      console.log('parseISO month value: ' + isoMonth);
      var month = $scope.isoMonthToNumber(isoMonth);
      console.log('parseISO converted month value: ' + month);
      var dayTime = split[2];
      var dayTimeSplit = dayTime.split('T');
      var day = dayTimeSplit[0];
      console.log('parseISO day value: ' + day);

      var newDate = month + '/' + day + '/' + year;
      console.log('parsedISODate returns: ' + newDate);

    }


    // $scope.setWeekViewDates = function(startDate, endDate){
    //
    // }

    $scope.getRunDatesByMonth= function(monthNumber){
      switch(monthNumber){
        case "01":
          console.log('$scope.januaryRunDates returned value of: ' + $scope.januaryRunDates);
          return $scope.januaryRunDates;
        case "02":
          console.log('$scope.februaryRunDates returned value of: ' + $scope.februaryRunDates);
          return $scope.februaryRunDates;
        case "03":
          console.log('$scope.marchRunDates returned value of: ' + $scope.marchRunDates);
          return $scope.marchRunDates;
        case "04":
          console.log('$scope.aprilRunDates returned value of: ' + $scope.aprilRunDates);
          return $scope.aprilRunDates;
        case "05":
          console.log('$scope.mayRunDates returned value of: ' + $scope.mayRunDates);
          return $scope.mayRunDates;
        case "06":
          console.log('$scope.juneRunDates returned value of: ' + $scope.juneRunDates);
          return $scope.juneRunDates;
        case "07":
          console.log('$scope.julyRunDates returned value of: ' + $scope.julyRunDates);
          return $scope.julyRunDates;
        case "08":
          console.log('$scope.augustRunDates returned value of: ' + $scope.augustRunDates);
          return $scope.augustRunDates;
        case "09":
          console.log('$scope.septemberRunDates returned value of: ' + $scope.septemberRunDates);
          return $scope.septemberRunDates;
        case "10":
          console.log('$scope.octoberRunDates returned value of: ' + $scope.octoberRunDates);
          return $scope.octoberRunDates;
        case "11":
          console.log('$scope.novemberRunDates returned value of: ' + $scope.novemberRunDates);
          return $scope.novemberRunDates;
        case "12":
          console.log('$scope.decemberRunDates returned value of: ' + $scope.decemberRunDates);
          return $scope.decemberRunDates;
        default:
          console.log('Error gettin distances by Month');
          break;
      }
    }
    $scope.getDistancesByMonth= function(monthNumber){
      switch(monthNumber){
        case "01":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.januaryRunDistances;
        case "02":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.februaryRunDistances;
        case "03":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.marchRunDistances;
        case "04":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.aprilRunDistances;
        case "05":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.mayRunDistances;
        case "06":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.juneRunDistances;
        case "07":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.julyRunDistances;
        case "08":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.augustRunDistances;
        case "09":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.septemberRunDistances;
        case "10":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.octoberRunDistances;
        case "11":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.novemberRunDistances;
        case "12":
          console.log('$scope.julyRunDistances returned value of: ' + $scope.julyRunDistances);
          return $scope.decemberRunDistances;
        default:
          console.log('Error gettin distances by Month');
          break;
      }
    }


    HistoryAPI.getAll($rootScope.getUserId())
      .success(function (data) {
        console.log(data);
        console.log('History API get user history call succeeded');


        for (var i = 0; i < data.length; i++) {
          console.log('i:' + i);

          var HistoryLoggerForm = {
            // User: "",
            // _v: "",
            _id: data[i]._id,
            date: data[i].date,
            distance: data[i].distance,
            // laps: [],
            minutes: data[i].minutes,
            pace: data[i].pace,
            // path:[],
            seconds: data[i].seconds,
            moneyRaised: data[i].moneyRaised
          };
          console.log('HistoryLoggerForm: ' + HistoryLoggerForm._id);
          $scope.ids.push(HistoryLoggerForm._id);
          console.log('$scope.ids: ' + $scope.ids);

          var formattedDate = $scope.parseUTCDate(data[i].date);
          console.log('Formatted Date: ' + formattedDate);

          $scope.dates.push(formattedDate);
          // console.log('$scope.dates: ' + $scope.dates[i]);
          console.log('$scope.dates: ' + $scope.dates);

          $scope.distances.push(HistoryLoggerForm.distance);
          console.log('$scope.distances: ' + $scope.distances[i]);
          console.log('$scope.distances: ' + $scope.distances);

          $scope.minutes.push(HistoryLoggerForm.minutes);
          // console.log('$scope.minutes: ' + $scope.minutes[i]);
          console.log('$scope.minutes: ' + $scope.minutes);

          $scope.paces.push(HistoryLoggerForm.pace);
          // console.log('$scope.pace: ' + $scope.paces[i]);
          console.log('$scope.pace: ' + $scope.paces);

          $scope.seconds.push(HistoryLoggerForm.seconds);
          // console.log('$scope.seconds: ' + $scope.seconds[i]);
          console.log('$scope.seconds: ' + $scope.seconds);

          if(HistoryLoggerForm.moneyRaised == undefined){
            var mRaised = 0;
            $scope.moneyRaised.push(mRaised);
            // console.log('$scope.moneyRaised: ' + $scope.moneyRaised[i]);
            console.log('$scope.moneyRaised: ' + $scope.moneyRaised);

            // return $scope.moneyRaised;
          } else {
            $scope.moneyRaised.push(HistoryLoggerForm.moneyRaised);
            // console.log('$scope.moneyRaised: ' + $scope.moneyRaised[i]);
            console.log('$scope.moneyRaised: ' + $scope.moneyRaised);
            // return $scope.moneyRaised;
          }

          var m = $scope.assignMonth($scope.dates[i]);
          console.log('M: ' + m);

          var monthRunPacesTest = $scope.setMonthValues(m, $scope.dates[i], $scope.distances[i], $scope.seconds[i],
                    $scope.minutes[i], $scope.paces[i], $scope.moneyRaised[i]);

          var getJulyRunDistancesTest = $scope.getDistancesByMonth(m);
          console.log('getJulyRunDistancesTest returned value of: ' + getJulyRunDistancesTest);
          var getJulyRunDatesByMonthTest = $scope.getRunDatesByMonth(m);
          console.log('getJulyRunDatesByMonthTest returned dates of: ' + getJulyRunDatesByMonthTest);

          console.log('$scope.today: ' + $scope.today);
          var parsedISODate = $scope.parseISOdate($scope.today);



        }

      })
      .error(function (err) {
        console.log('Get User history API request failed');
        console.log(err);

      });


  });
