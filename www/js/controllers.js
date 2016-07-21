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
  .controller('SigninCtrl', function($scope, $rootScope, $timeout, AuthAPI, $ionicPopup, $window, ngFB){

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

          console.log('Charity: ' + $scope.user.charity);
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

    $scope.loginByFB = function() {

      console.log("begin login by FB");
      ngFB.login({scope:'email'}).then(function (response){
        if (response.status == 'connected') {

          AuthAPI.signinByFB({
            access_token: response.authResponse.accessToken
          }).success(function(data, status, headers, config){
            $rootScope.hide();
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

    $scope.popup = {
      email: ""
    }

    $scope.showForgotPassword = function(){
      var forgotPassword = $ionicPopup.show({
        template: '<input type="email" ng-model="popup.email">',
        title: 'Enter Email for Password Reset',
        //subTitle: 'Whatever you want',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>submit</b>',
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

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $interval, RunAPI, AuthAPI){
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
      lapUI.style.top = '10px';
      lapUI.style.height = '50px';
      lapUI.style.width = '556px';
      lapUI.style.bottom = '150px';
      lapUI.style.position = 'relative';
      lapUI.style.zIndex = '10';
      lapUI.style.marginBottom = '100px';
      lapUI.style.textAlign = 'center';
      lapUI.title = 'Lap';
      buttonDiv.appendChild(lapUI);

      var lapText = document.createElement('div');
      lapText.style.color = 'rgb(255, 255, 255)';
      lapText.style.fontFamily = 'HelveticaNeue-Light';
      lapText.style.fontSize = '50px';
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
      pauseUI.style.top = '10px';

      pauseUI.style.height = '50px';
      pauseUI.style.width = '556px';

      pauseUI.style.zIndex = '10';
      pauseUI.style.marginBottom = '50px';
      pauseUI.style.textAlign = 'center';
      pauseUI.title = 'Pause';
      buttonDiv.appendChild(pauseUI);

      var pauseText = document.createElement('div');
      pauseText.style.color = '#00b9be';
      pauseText.style.fontFamily = 'Roboto,Arial,sans-serif';
      pauseText.style.fontSize = '50px';
      pauseText.style.lineHeight = '50px';
      pauseText.style.lineWidth = '556px';
      pauseText.style.paddingLeft = '5px';
      pauseText.style.paddingRight = '5px';
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
      resumeUI.style.top = '10px';
      resumeUI.style.height = '50px';
      resumeUI.style.width = '556px';
      resumeUI.style.bottom = '150px';
      resumeUI.style.position = 'relative';
      resumeUI.style.zIndex = '10';
      resumeUI.style.marginBottom = '100px';
      resumeUI.style.textAlign = 'center';
      resumeUI.title = 'Lap';
      pausedDiv.appendChild(resumeUI);

      var resumeText = document.createElement('div');
      resumeText.style.color = 'rgb(255, 255, 255)';
      resumeText.style.fontFamily = 'Roboto,Arial,sans-serif';
      resumeText.style.fontSize = '50px';
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
      stopUI.style.backgroundColor = '#00b9be';
      stopUI.style.align = 'center';
      stopUI.style.border = '2px solid #00b9be';
      stopUI.style.borderRadius = '3px';
      stopUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      stopUI.style.cursor = 'pointer';
      stopUI.style.top = '10px';
      stopUI.style.height = '50px';
      stopUI.style.width = '556px';
      stopUI.style.bottom = '150px';
      stopUI.style.position = 'relative';
      stopUI.style.zIndex = '10';
      stopUI.style.marginBottom = '100px';
      stopUI.style.textAlign = 'center';
      stopUI.title = 'Lap';
      pausedDiv.appendChild(stopUI);

      var stopText = document.createElement('div');
      stopText.style.color = 'rgb(255, 255, 255)';
      stopText.style.fontFamily = 'Roboto,Arial,sans-serif';
      stopText.style.fontSize = '50px';
      stopText.style.lineHeight = '50px';
      stopText.style.lineWidth = '556px';
      stopText.style.paddingLefft = '5px';
      stopText.style.paddingRight = '5px';
      stopText.innerHTML = 'Stop';
      stopUI.appendChild(stopText);

      stopUI.addEventListener('click', function () {
        console.log('%cstop activated', 'color: Teal');
        $scope.stopRun();
      });

      $scope.removeStop = function(){
        pausedDiv.removeChild(stopUI);
      }

      $scope.addStop = function(){
        pausedDiv.appendChild(stopUI);
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
      startUI.style.top = '10px';
      startUI.style.left = '300px';
      startUI.style.right = '400px';
      startUI.style.height = '50px';
      startUI.style.width = '800px';
      startUI.style.zIndex = '10';
      startUI.style.marginBottom = '50px';
      startUI.style.textAlign = 'center';
      startUI.title = 'Start dreamrun';
      startDiv.appendChild(startUI);

      var startText = document.createElement('div');
      startText.style.color = 'rgb(255, 255, 255)';
      startText.style.fontFamily = 'Roboto,Arial,sans-serif';
      startText.style.fontSize = '50px';
      startText.style.lineHeight = '50px';
      startText.style.lineWidth = '556px';
      // startText.style.paddingLeft = '5px';
      // startText.style.paddingRight = '5px';
      startText.innerHTML = 'Start My DREAM<b>RUN</b>';
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
      summaryButtonUI.style.top = '10px';

      summaryButtonUI.style.height = '50px';
      summaryButtonUI.style.width = '556px';

      summaryButtonUI.style.zIndex = '10';
      summaryButtonUI.style.marginBottom = '50px';
      summaryButtonUI.style.textAlign = 'center';
      summaryButtonUI.title = 'Pause';
      summaryButtonDiv.appendChild(summaryButtonUI);

      var summaryButtonText = document.createElement('div');
      summaryButtonText.style.color = '#00b9be';
      summaryButtonText.style.fontFamily = 'Roboto,Arial,sans-serif';
      summaryButtonText.style.fontSize = '50px';
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
      return $scope.myLatLng;
      console.log('%cReturning myLatLng from userCoords: ' + $scope.myLatLng, 'color: Purple');
      console.log('%cuser Coords Interval mark, refreshing coords', 'color: Purple');
    }

    //distance functions
    var distanceInitializer;
    $scope.runDistance = function(){
      $scope.distanceCoords = [];
      console.log('%cEmpty coorindate arry for distance function initialized' + $scope.distanceCoords, 'color: Purple');

      distanceInitializer = $interval(function(){
        var currentCoords = $scope.userCoords();
        console.log('%cuser Coords called from within distance initializers: ' + currentCoords, 'color: Purple');

        $scope.distanceCoords.push(currentCoords);
        console.log('%cCurrent coords pushed to distance array. distanceCoords values: ' + $scope.distanceCoords, 'color: Purple');

        $rootScope.setRunPath($scope.distanceCoords);
        console.log('Run path global var set as: ' + $rootScope.getRunPath());
        $scope.distance = google.maps.geometry.spherical.computeLength({
          path: $scope.distanceCoords
        });
        console.log('%cDistance: ' +$scope.distance, 'color: Purple');
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

      $scope.distanceCoords = [];
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
      $scope.minutes = 0;
      $scope.seconds = 0;
    }

    //lap functions
    var startLapTimer;
    $scope.startLapTimer = function(){
      startLapTimer = $interval(function(){
        console.log('%cLap timer started', 'color: Blue');
        if($scope.lapSeconds < 60) {
          console.log('%cLap seconds checked, incremented', 'color: Blue');
          $scope.lapSeconds++;
          console.log('%cLap seconds: ' + $scope.lapSeconds, 'color: Blue');
          // $rootScope.setLapSeconds($scope.lapSeconds);
          // $rootScope.setLapMinutes($scope.lapMinutes);
          // console.log('Lap Minutes global var: ' + $rootScope.getLapMinutes() + '; Lap seconds  global var: ' + $rootScope.getLapSeconds());

          if ($scope.lapSeconds > 59) {
            console.log('%cLap seconds reached 60, reset to 0', 'color: Blue');
            $scope.lapSeconds = 0;
            console.log('%cLap seconds: ' + $scope.lapSeconds, 'color: Blue');
            $scope.lapMinutes++;
            console.log('%cLap minutes: ' + $scope.lapMinutes, 'color: Blue');
            console.log('%cLap minutes incremented', 'color: Blue');

            // $rootScope.setLapSeconds($scope.lapSeconds);
            // $rootScope.setLapMinutes($scope.lapMinutes);
            // console.log('Lap Minutes global var: ' + $rootScope.getLapMinutes() + '; Lap seconds  global var: ' + $rootScope.getLapSeconds());

          }
        }
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
      $scope.lapSeconds = 0;
      $scope.lapMinutes = 0;
    }

    $scope.laps = [];


    var lapDistanceInitializer;
    $scope.getLapDistance = function(){
      console.log('%cLap distance function activated', 'color: MediumPurple');

      $scope.lapCoords = [];
      console.log('%cEmpty lap coords array initialized: ' + $scope.lapCoords, 'color: MediumPurple');

      lapDistanceInitializer = $interval(function(){
        $scope.userCoords();
        console.log('%cGet current coords called from lap distance', 'color: MediumPurple');

        var currentCoords = $scope.userCoords();

        $scope.lapCoords.push(currentCoords);
        console.log('%cLap coords array' + currentCoords, 'color: MediumPurple');

        // $rootScope.setLapPath($scope.lapCoords);
        // console.log('Lap path global var set as: '+$rootScope.getPath());

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
    $scope.laps = [];

    $scope.lap = function(){

      //pace functions for everything
      //log lap values

      console.log('%cLap Number: ' + $scope.lapNumber, 'color: Aqua');
      console.log('%cLap Seconds: ' + $scope.lapSeconds, 'color: Aqua');
      console.log('%cLap minutes: ' + $scope.lapMinutes, 'color: Aqua');
      console.log('%cLap distance: ' + $scope.lapDistance, 'color: Aqua');

      var time = $scope.lapMinutes + ':' +$scope.lapSeconds;



      $scope.stopLapTimer();
      $scope.stopLapDistance();
      $scope.stopLapPaceCalculator();


      $rootScope.setLapPath($scope.lapCoords);
      console.log('Lap path global var set as: '+$rootScope.getLapPath());

      $rootScope.setLapDistance($scope.lapDistance);
      console.log('Lap distance global var: ' + $rootScope.getLapDistance());

      $rootScope.setLapNumber($scope.lapNumber);
      console.log('Lap Number global var set as: ' + $rootScope.getLapNumber());

      $rootScope.setLapSeconds($scope.lapSeconds);
      $rootScope.setLapMinutes($scope.lapMinutes);
      console.log('Lap Minutes global var: ' + $rootScope.getLapMinutes() + '; Lap seconds  global var: ' + $rootScope.getLapSeconds());

      var l = {
        number: $rootScope.getLapNumber(),
        distance:  $rootScope.getLapDistance(),
        seconds: $rootScope.getLapSeconds(),
        minutes: $rootScope.getLapMinutes(),
        pace: $rootScope.getLapPace(),
        path: $rootScope.getLapPath()
      };

      $scope.laps.push(l);
      console.log('Laps array (for push) set as: ' + $scope.laps);
      $rootScope.setLaps($scope.laps);
      console.log('Laps array global var set as: ' + $rootScope.getToken());

      $scope.startLapTimer();
      $scope.getLapDistance();
      $scope.lapPaceCalculator();
      $scope.lapNumber++;
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

        milesPerSecond = 10 / time;
        console.log('%cMiles per second: ' + milesPerSecond, 'color: Gold');

        $scope.pace = milesPerSecond * 60;
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

        milesPerSecond = 10 / time;
        console.log('%cMiles per second: ' + milesPerSecond, 'color: DarkGoldenRod ');

        $scope.lapPace = milesPerSecond * 60;
        console.log('%cMiles per minute (Pace): ' + $scope.lapPace, 'color: DarkGoldenRod ');

        $rootScope.setLapPace($scope.lapPace);
        console.log('Lap pace global var: ' + $rootScope.getLapPace());

      }, 2100);
    }
    $scope.stopLapPaceCalculator = function(){
      console.log('%cStopping pace calculator... ', 'color: DarkGoldenRod ');
      $interval.cancel(lapPaceInitializer);
      lapPaceInitializer = undefined;
      $scope.lapPace = 0;
    }

    //money raised calculator

    $scope.moneyRaisedCalculator = function(){
      console.log('%cMoney raised calculator active', 'color: Grey');


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


      // console.log("Attempting to remove dropdown info");
      // $scope.removeWelcomeUI();


      console.log("%cAttempting to remove start button...", 'color: HotPink');
      $scope.removeStartUI();


      var buttonControlDiv = document.createElement('div');
      var buttonControl = $scope.runButtonControl(buttonControlDiv, $scope.map);

      buttonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(buttonControlDiv);

      // var runInfoControlDiv = document.createElement('div');
      // var runInfoControl = $scope.runInfoControl(runInfoControlDiv, $scope.map);
      //
      // runInfoControlDiv.index = 1;
      // $scope.map.controls[google.maps.ControlPosition.TOP].push(runInfoControlDiv);

      $scope.run();


    };

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
      console.log('Push run- Laps: ' + $rootScope.getLaps());



      var form = {
        distance: $rootScope.getRunDistance(),
        seconds: $rootScope.getRunSeconds(),
        minutes: $rootScope.getRunMinutes(),
        pace: $rootScope.getRunPace(),
        User: $rootScope.getUserId(),
        runPath: $rootScope.getRunPath(),
       // laps: [$rootScope.getLaps()],
        date: Date.now()
      }

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

  .controller('AppCtrl', function($rootScope, $scope, $filter, $ionicModal, $timeout, DonationAPI) {

    $scope.fetchMyPledges = function() {
      $rootScope.$broadcast("fetchMyPledges");
    }

    $scope.fetchMySponsors = function() {
      $rootScope.$broadcast("fetchMySponsors");
    }

    $rootScope.$on('fetchMySponsors', function() {
      DonationAPI.getAllSponsors($rootScope.getToken(),"577525799f1f51030075a291").success(function(data, status, headers, config){
        $scope.sponsors = [];
        for (var i = 0; i < data.length; i++) {
          $scope.sponsors.push(data[i]);
        }
        if(data.length == 0) {
          $scope.noSponsor = true;
        } else {
          $scope.noSponsor = false;
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

    // $rootScope.$on('fetchSelectedCharity', function(){
    //   //TODO: FETCH, SERVER FOR USER SELECTED CHARITY, UI FOR ID PARAMS
    //   CharityAPI.getSelectedCharity()
    // });

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


    $scope.selectCharity = function(charity){

      var email = $rootScope.getEmail();
      console.log('email: ' + email);
      console.log('charity: ' + charity);
      $rootScope.setSelectedCharity(charity);
      charity = $rootScope.getSelectedCharity();
      console.log('charity: ' + $rootScope.getSelectedCharity());
      console.log('attempting to update user\'s selected charity');

      console.log('attempting to update user\'s selected charity');

      CharityAPI.selectCharity({
          charity: charity},{
          email:email})
        .success(function(data, status, headers, config){

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
        charity:"5771430bdcba0f275f2a0a5e",
        userId:"577525799f1f51030075a291"
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

    /*Chart Configuration*/
    $scope.labels = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];
    $scope.series = ['Miles Run'];

    $scope.data = [
      [5, 0, 3, 5, 7, 11, 9]
    ];

    $scope.colors = [{
      "backgroundColor": "#00b9be"
    }];

    $scope.options = {
      legend: {
        display: false,
        position: "left",
        labels: {
          fontFamily: "Helvetica Neue",
          boxWidth: 0
        }
      },

      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 2,
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

    $scope.onClick = function (bar, evt) {
      console.log(bar, evt);
      if (bar[0] != null) {
        console.log("Bar with value " + $scope.data[0][bar[0]._index] + " clicked");
      }
    };
    /*CHART NOTE
    It is very easy to display the bar chart. The labels array is for the days and the data array is for the miles for those days
    End Chart Configuration
     */


    console.log('empty user history array initialized: ' + $scope.uHistory);

    var today = Date.now();
    $scope.endDate = new Date(today);
    console.log('end date: ' + $scope.endDate);
    var newDate = new Date($scope.endDate);
    newDate.setDate(newDate.getDate() - 7);
    $scope.startDate = new Date(newDate);


    console.log('start date' + $scope.startDate);

    var HistoryLoggerForm = {
      // User: "",
      // _v: "",
      _id: "",
      date: new Date(),
      distance: Number,
      // laps: [],
      minutes: Number,
      pace: Number,
      // path:[],
      seconds: Number
    }


    console.log('user id is: ' +$rootScope.getUserId());
    HistoryAPI.getAll(  $rootScope.getUserId()  )
      .success(function(data){
        console.log(data);
        console.log('History API get user history call succeeded');
        $scope.uHistory = [];
        $scope.ids = [];
        $scope.dates = [];
        $scope.distances = [];
        $scope.minutes = [];
        $scope.paces = [];
        $scope.seconds  = [];

        for(var i = 0; i<data.length; i++){
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
              seconds: data[i].seconds
            };
            console.log('HistoryLoggerForm: '+ HistoryLoggerForm._id);
            $scope.ids.push(HistoryLoggerForm._id);
            console.log('$scope.ids: ' + $scope.ids);
            $scope.dates.push(HistoryLoggerForm.date);
            console.log('$scope.dates: ' + $scope.dates);
            $scope.distances.push(HistoryLoggerForm.distance);
            console.log('$scope.distances: ' + $scope.distances);
            $scope.minutes.push(HistoryLoggerForm.minutes);
            console.log('$scope.minutes: ' + $scope.minutes);
            $scope.paces.push(HistoryLoggerForm.pace);
            console.log('$scope.pace: ' + $scope.paces);
            $scope.seconds.push(HistoryLoggerForm.seconds);
            console.log('$scope.seconds: ' + $scope.seconds);
        }
      })
      .error(function(err){
        console.log('Get User history API request failed');
        console.log(err);
      });

    $scope.getCurrentWeekHistory = function(){
      var today = Date.now();
      $scope.endDate = new Date(today);
      console.log('end date: ' + $scope.endDate);
      var newDate = new Date($scope.endDate);
      newDate.setDate(newDate.getDate() - 7);
      $scope.startDate = new Date(newDate);

      for(var i=0; i< $scope.dates.length;  i++){
        if($scope.dates[i].date >= $scope.startDate && $scope.uHistory[i].date <= $scope.endDate){
          $scope.weekHistory.push($scope.uHistory[i]);
        }
      }
    }

    $scope.decrementWeek = function(){
      var weekStartDate = new Date();
      var weekEndDate = new Date();
      weekEndDate.setDate($scope.startDate.getDate() -1);
      console.log('weekEndDate: ' + weekEndDate);
      weekStartDate.setDate(weekEndDate.getDate() -7);
      console.log('weekStartDate: ' + weekStartDate);
      $scope.endDate =  new Date(weekEndDate);
      console.log('$scope.endDate'+ $scope.endDate);
      $scope.startDate = new Date(weekStartDate);
      console.log('$scope.startDate' + $scope.startDate);

      console.log('$scope.dates: ' + $scope.dates)
      console.log('$scope.dates.length: ' + $scope.dates.length );

      $scope.weekIds = [];
      $scope.weekDates = [];
      $scope.weekDistances = [];
      $scope.weekMinutes = [];
      $scope.weekPace = [];
      $scope.weekSeconds = [];

      for(var i=0; i < $scope.dates.length; i++){
          $scope.weekDates.push($scope.dates[i]);
          console.log('$scope.weekDates: ' + $scope.weekDates);
          $scope.weekIds.push($scope.ids[i]);
          console.log('$scope.weekIds: '+$scope.weekIds);
          $scope.weekDistances.push($scope.distances[i]);
          console.log('$scope.weekDistances: ' + $scope.weekDistances);
          $scope.weekMinutes.push($scope.minutes[i]);
          console.log('$scope.weekDates: ' + $scope.weekDates);
          $scope.weekPace.push($scope.paces[i]);
          console.log('$scope.paces: ' + $scope.weekPace);
          $scope.weekSeconds.push($scope.seconds[i]);
          console.log('$scope.weekSeconds: ' + $scope.weekSeconds);
        if($scope.dates[i] >= $scope.startDate && $scope.dates[i] <= $scope.endDate){
          $scope.weekDates.push($scope.dates[i]);
          console.log('$scope.weekDates: ' + $scope.weekDates);
          $scope.weekIds.push($scope.ids[i]);
          console.log('$scope.weekIds: '+weekIds);
          $scope.weekDistances.push($scope.distances[i]);
          console.log('$scope.weekDistances: ' + $scope.weekDistances);
          $scope.weekMinutes.push($scope.minutes[i]);
          console.log('$scope.weekDates: ' + $scope.weekDates);
          $scope.weekPace.push($scope.paces[i]);
          console.log('$scope.paces: ' + $scope.weekPace);
          $scope.weekSeconds.push($scope.seconds[i]);
          console.log('$scope.weekSeconds: ' + $scope.weekSeconds);

        }

      }


    }


  });
