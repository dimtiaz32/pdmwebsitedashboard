angular.module('starter.controllers', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.accountServices',
  'starter.accountServices',
  'starter.donationServices',
  'starter.runServices'
])




  .controller('SignUpCtrl', function($scope, $rootScope, $ionicModal, $timeout, AuthAPI, $window){
    $scope.user = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };

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
        password: password
      }).success(function (data, status, headers, config){
        //TODO: FIND OUT HOW TO SEPARATE THE TOKEN FROM THE RETURNED OBJECT AND SET AS TOKEN

        $rootScope.hide();
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

  .controller('LoginCtrl', function($scope, $rootScope, $timeout, AuthAPI, $window){

    $scope.user = {
      email: "",
      password: ""
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
          $rootScope.hide();
          $window.location.href=('#/app/run');
        })
        .error(function(error){
          $rootScope.hide();
          $rootScope.notify("Invalid username or password");
        });
    };

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

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $document, RunAPI){

     $scope.isDetailDisplayed = false;
     $scope.isHistoryDetailDisplayed = true;
     $scope.isRunning = false;
     $scope.isPaused = false;

    $scope.toggleRun = function() {
      $scope.isRunning = !$scope.isRunning;
    }

    $scope.lapBtnTapped = function() {
      if ($scope.isPaused) {
        resume();
      } else {
        lap();
      }
    }

    $scope.pause = function() {
      $scope.isPaused = true;
    }

    function resume() {
      $scope.isPaused = false;
    }

    function lap() {
      console.log("lap");
    }




    $scope.lapControl = function(lapDiv, map){
      var lapUI = document.createElement('div');
      lapUI.style.backgroundColor = '#00b9be';
      lapUI.style.align = 'center';
      lapUI.style.border  = '2px solid #00b9be';
      lapUI.style.borderRadius = '3px';
      lapUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      lapUI.style.cursor = 'pointer';
      lapUI.style.top = '10px';
      // lapUI.style.left = '300px';
      // lapUI.style.right = '400px';
      lapUI.style.height = '50px';
      lapUI.style.width = '556px';
      lapUI.style.bottom = '150px';
      lapUI.style.position = 'relative';
      lapUI.style.zIndex = '10';
      lapUI.style.marginBottom = '0px';
      lapUI.style.textAlign = 'center';
      lapUI.title = 'Start dreamrun';
      lapDiv.appendChild(lapUI);

      var lapText = document.createElement('div');
      lapText.style.color = 'rgb(255, 255, 255)';
      lapText.style.fontFamily = 'Roboto,Arial,sans-serif';
      lapText.style.fontSize = '50px';
      lapText.style.lineHeight = '50px';
      lapText.style.lineWidth = '556px';
      lapText.style.paddingLefft = '5px';
      lapText.style.paddingRight = '5px';
      lapText.innerHTML = 'Lap';
      lapUI.appendChild(lapText);

      lapUI.addEventListener('click', function(){
        console.log('lap activated');
      });
    };

    $scope.pauseControl = function(pauseDiv, map){
      var pauseUI = document.createElement('div');
      pauseUI.style.backgroundColor = '#ffffff';
      pauseUI.style.border  = '2px solid #ffffff';
      pauseUI.style.borderRadius = '3px';
      pauseUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      pauseUI.style.cursor = 'pointer';
      pauseUI.style.top = '10px';
      // pauseUI.style.left = '300px';
      // pauseUI.style.right = '400px';
      pauseUI.style.height = '50px';
      pauseUI.style.width = '556px';

      pauseUI.style.zIndex = '10';
      pauseUI.style.marginBottom = '50px';
      pauseUI.style.textAlign = 'center';
      pauseUI.title = 'Start dreamrun';
      pauseDiv.appendChild(pauseUI);

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

      pauseUI.addEventListener('click', function(){
          console.log('pause button activated');
      });
    };


    $scope.runInfo = function(infoDiv, map, drop){
      var infoUI = document.createElement('div');
      infoUI.id = 'infoUI';
      infoUI.style.height = '400px';
      infoUI.style.width = '400px';
      infoUI.style.textAlign = 'center';
      infoUI.title = 'Info';
      infoDiv.appendChild(infoUI);

      var durationDiv = document.createElement('div');
      durationDiv.id = 'durationDiv';
      durationDiv.style.height = '100px';
      durationDiv.style.width = '100px';
      durationDiv.style.title = 'Duration';

      //next two text go inside duration div
      var durationLabelText = document.createElement('p');
      durationLabelText.id = 'durationLabelText';
      durationLabelText.innerHTML = 'Duration';
      durationDiv.appendChild(durationLabelText);

      var durationTimeText = document.createElement('p');
      durationTimeText.id = 'durationTimeText';
      durationLabelText.innerHTML = 'durationTime';
      durationDiv.appendChild(durationTimeText);
      //adds duration div to infoUI
      infoUI.appendChild(durationDiv);

      var distanceDiv = document.createElement('div');
      distanceDiv.id = 'distanceDiv';
      distanceDiv.style.height = '100px';
      distanceDiv.style.width = '100px';
      distanceDiv.title = 'Distance';

      var distanceLabelText = document.createElement('p');
      distanceLabelText.id = 'distanceLabelText';
      distanceLabelText.innerHTML = 'Distance';
      distanceDiv.appendChild(distanceLabelText);

      var distanceTrackerText = document.createElement('p');
      distanceTrackerText.id = 'distanceTrackerText';
      distanceTrackerText.innerHTML = 'DistanceTrackerText';
      distanceDiv.appendChild(distanceTrackerText);
      infoUI.appendChild(distanceDiv);

      var paceDiv = document.createElement('div');
      paceDiv.id = 'paceDiv';
      paceDiv.style.height = '100px';
      paceDiv.style.width = '100px';
      paceDiv.style.title = 'Pace';

      var paceLabelText = document.createElement('p');
      paceLabelText.id = 'paceLabelText';
      paceLabelText.innerHTML = 'Pace';
      paceDiv.appendChild(paceLabelText);

      var paceTrackerText = document.createElement('p');
      paceTrackerText.id = 'paceTrackerText';
      paceTrackerText.innerHTML = 'paceTrackerText';
      paceDiv.appendChild(paceTrackerText);
      infoUI.appendChild(paceDiv);

      var fundsRaisedDiv = document.createElement('div');
      fundsRaisedDiv.id = 'fundsRaisedDiv';
      fundsRaisedDiv.style.height = '100px';
      fundsRaisedDiv.style.width = '100px';
      fundsRaisedDiv.title = 'fundsRaised';

      var fundsRaisedLabelText = document.createElement('p');
      fundsRaisedLabelText.id = 'fundsRaisedLabelText';
      fundsRaisedLabelText.innerHTML = 'Funds Raised';
      fundsRaisedDiv.appendChild(fundsRaisedLabelText);

      var fundsRaisedTrackerText = document.createElement('p');
      fundsRaisedTrackerText.id = 'fundsRaisedTrackerText';
      fundsRaisedTrackerText.innerHTML = 'funds Raised tracker text';
      fundsRaisedDiv.appendChild(fundsRaisedTrackerText);
      infoUI.appendChild(fundsRaisedDiv);



    };



    $scope.startRun  = function(){

    };




    $scope.welcomeControl = function(welcomeDiv, map, drop){
      var control = this;

      control.drop_ = drop;


      var welcomeUI = document.createElement('div');
      welcomeUI.id = 'welcomeUI';
      welcomeUI.style.backgroundColor = '#ffffff';
      welcomeUI.style.border = '2px solid #00b9be';
      welcomeUI.style.borderRadius = '3px';
      welcomeUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      welcomeUI.style.cursor = 'pointer';
      welcomeUI.style.height = '100px';
      welcomeUI.style.width = '1000px';
      welcomeUI.style.top = '100px';
      welcomeUI.ngShow = $scope.isRunning;
      // welcomeUI.style.left = '300px';
      // welcomeUI.style.right = '300px';
      welcomeUI.style.zIndex = '20px';
      // welcomeUI.style.marginTop = '100px';
      welcomeUI.style.textAlign = 'center';
      welcomeUI.title = 'Welcome';
      welcomeDiv.appendChild(welcomeUI);

      var welcomeText = document.createElement('div');
      welcomeText.id = 'welcomeUserText';
      welcomeText.innerHTML = 'Welcome Jane Doe';
      welcomeUI.appendChild(welcomeText);

      var divider = document.createElement('hr');
      divider.id = 'welcomeDivider';
      welcomeUI.appendChild(divider);

      var milesRaisesText = document.createElement('p');
      milesRaisesText.id = 'milesRaises';
      milesRaisesText.style.textAlign = 'center';
      milesRaisesText.style.color = '#00b9be';
      milesRaisesText.innerHTML = 'Every Mile raises 50 cents for ';
      welcomeUI.appendChild(milesRaisesText);

      var charitySelectedText = document.createElement('h');
      charitySelectedText.id = 'charittySelectedText';
      //charitySelectedText.style.textAlign = 'center';
      charitySelectedText.innerHTML = 'Teens Run DC';
      welcomeUI.appendChild(charitySelectedText);

      //these elements will be added to the ui from the event listener on the drop down button
      var detailDivider = document.createElement('hr');
      detailDivider.id = 'detailDivider';

      var thisWeekText= document.createElement('div');
      thisWeekText.id = 'thisWeekText';
      thisWeekText.innerHTML = 'This week';

      var weekMoneyRaisedText = document.createElement('p');
      weekMoneyRaisedText.id = 'weekMoneyRaisedText';
      weekMoneyRaisedText.innerHTML = '$17.50 raised and';

      var weekDistanceText = document.createElement('p');
      weekDistanceText.id = 'weekDistanceText';
      weekDistanceText.innerHTML = '34 miles for charity';

      var thisMonthText = document.createElement('p');
      thisMonthText.id = 'thisMonthText';
      thisMonthText.innerHTML = 'This month';

      var monthMoneyRaisedText = document.createElement('p');
      monthMoneyRaisedText.id = 'moneyMoneyRaisedText';
      monthMoneyRaisedText.innerHTML = '$50.10';

      var monthDistanceText = document.createElement('p');
      monthDistanceText.id = 'monthDistanceText';
      monthDistanceText.innerHTML = '100 miles run for charity';

      var dropButton = document.createElement('button');
      dropButton.id = 'dropButton';
      dropButton.style.position = 'absolute';
      dropButton.style.width = '50px';
      dropButton.style.marginTop = '30px';
      dropButton.style.position = 'center';
      dropButton.class = 'button button-slide';
      //dropButton.ngClass = 'isDetailDisplayed ? "button-slide-down" : "button-slide-up"';
      welcomeUI.appendChild(dropButton);
      dropButton.addEventListener('click', function(){
        // if($scope.isHistoryDetailDisplayed = false){
        //   $scope.isHistoryDetailDisplayed = true;
        //   welcomeUI.appendChild(detailDivider);
        //   welcomeUI.appendChild(thisWeekText);
        //   welcomeUI.appendChild(weekMoneyRaisedText);
        //   welcomeUI.appendChild(weekDistanceText);
        //   welcomeUI.appendChild(thisMonthText);
        //   welcomeUI.appendChild(monthMoneyRaisedTexth);
        //   welcomeUI.appendChild(monthDistanceText);
        // } else {
        //   $scope.isHistoryDetailDisplayed = false;
        //   welcomeUI.removeChild(detailDivider);
        //   welcomeUI.removeChild(thisWeekText);
        //   welcomeUI.removeChild(weekMoneyRaisedText);
        //   welcomeUI.removeChild(weekDistanceText);
        //   welcomeUI.removeChild(thisMonthText);
        //   welcomeUI.removeChild(monthMoneyRaisedText);
        //   welcomeUI.removeChild(monthDistanceText);

        //}
      });





    };

    $scope.startControl = function(startDiv, map){
      var startUI = document.createElement('div');
      startUI.style.backgroundColor = '#00b9be';
      startUI.style.border  = '2px solid #00b9be';
      startUI.style.borderRadius = '3px';
      startUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      startUI.style.cursor = 'pointer';
      startUI.style.top = '10px';
      startUI.style.left = '300px';
      startUI.style.right = '400px';
      startUI.style.height = '50px';
      startUI.style.width = '800px';
      startUI.style.zIndex = '10px';
      startUI.style.marginBottom = '100px';
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

      startUI.addEventListener('click', function(){
        console.log("Starting button clicked");
        if(!$scope.map){
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Starting your dreamrun',
          showBackdrop: false
        });

        $scope.isRunning  = true;
        //$scope.startRun();

      });

    };

    $scope.mapCreated = function(map){
      $scope.map = map;

      if($scope.isRunning  = false) {

        var welcomeControlDiv = document.createElement('div');
        var welcomeControl = $scope.welcomeControl(welcomeControlDiv, map);

        welcomeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP].push(welcomeControlDiv);

        var startControlDiv = document.createElement('div');
        var startControl = $scope.startControl(startControlDiv, map);


        startControlDiv.index = 2;
        map.controls[google.maps.ControlPosition.BOTTOM].push(startControlDiv);
      } else if($scope.isRunning = true){
        var pauseControlDiv = document.createElement('div');
        var pauseControl = $scope.pauseControl(pauseControlDiv, map);

        pauseControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM].push(pauseControlDiv);

        var lapControlDiv = document.createElement('div');
        var lapControl = $scope.lapControl(lapControlDiv, map);

        lapControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.CENTER].push(lapControlDiv);
      }

    };



    $scope.centerOnMe = function(){
      console.log("Centering");
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
        $scope.hide();
      }, function(error){
        alert('Unable to get location: ' + error.message);
      });
    };
  })

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


})

  .controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, AuthAPI){

    CharityAPI.getAll()
      .success(function(data, status, headers, config){
        $rootScope.show("Retrieving our list of charities...");
        console.log("API call getAll succeeded");

        $scope.charityList = [];

        for(var i = 0; i < data.length; i++){
          $scope.list.push(data[i]);
        }
        $scope.select = function(){
          User.findCharity(
            {id: userId},
            {charityId: charityId})
          .sucess(function(status, data, headers, config){
            console.log('charity select- User.findCharity triggered successfull');
            for (var i = 0; i < charityList.length; i++){
              var check = charityList[i];
              if(check.id == charityId){
                //function to set status to selected, moves charity info to dropdown.

              }
            }
          });
        };

        $rootScope.hide();

      })
      .error(function(err){
        $rootScope.hide();
        $rootScope.notify("Something went wrong retrieving the list of charities");
        console.log("Error retrieving charities");
      });





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

.controller('MySponsorsCtrl',function($rootScope, $scope, $filter, DonationAPI){

      $scope.doRefresh = function() {
        DonationAPI.getAllSponsors($rootScope.getToken(),"577525799f1f51030075a291").success(function(data, status, headers, config){
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                data[i].end_date = $filter('date')(data[i].end_date,"MMM dd yyyy");
                $scope.list.push(data[i]);
            };

            if(data.length == 0) {
                $scope.noData = true;
            } else {
                $scope.noData = false;
            }

        }).error(function(data, status, headers, config){
            console.log("Refresh Error~");
            $rootScope.notify("Oops something went wrong!! Please try again later");
        }).finally(function(){
            console.log("Refresh Finally~");
            $scope.$broadcast('scroll.refreshComplete');
        });
      }

      // Do the first time when page loaded
      $scope.doRefresh();
})



.controller('AccountCtrl', function($rootScope, AuthAPI, AccountAPI, $window, $scope) {
  //refresh on page load?
  //Profile Picture - edit
  //Name- cannot edit
  //Email -edit
  //Password (hashed)
  //DOB-cannot edit

  //password should redirect to new page to enter old password/ could have dropdown?


  $scope.account = {
    firstName: "",
    lastName: "",
    pofilePicture: "",
    email: "",
    password: "",
    dob: "",
    created: "",
    updated: Date.now
  };


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

.controller('MyPledgesCtrl',function($rootScope, $scope, $filter, DonationAPI){
  $scope.doRefresh = function() {
    DonationAPI.getAllPledges($rootScope.getToken(),"577525799f1f51030075a292").success(function(data, status, headers, config){
        $scope.list = [];
        for (var i = 0; i < data.length; i++) {
            data[i].end_date = $filter('date')(data[i].end_date,"MMM dd yyyy");
            $scope.list.push(data[i]);
        };

        if(data.length == 0) {
            $scope.noData = true;
        } else {
            $scope.noData = false;
        }

    }).error(function(data, status, headers, config){
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
    }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // Do the first time when page loaded
  $scope.doRefresh();

  $scope.logout = function($window, AuthAPI){
    $rootScope.notify('Logging out...');
    console.log('Logout function started');
    // $localStorage.removeProfile();
    $window.localStorage.removeToken();
    $window.localStorage.removeChild();
    console.log('localStorage functions triggered');

    AccountAPI

    $window.location.href  ('#/app/signin');
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SponsorsPledgeCtrl', function($scope) {
  $scope.active = 'zero';
  $scope.setActive = function(type) {
    $scope.active = type;
  };
  $scope.isActive = function(type) {
    return type === $scope.active;
  };

  $scope.isChecked = false;

  $scope.toggleCheck = function() {
    $scope.isChecked = !$scope.isChecked;
    console.log("Checked");
  }
});
