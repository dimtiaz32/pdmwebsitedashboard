angular.module('starter.controllers', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.sponsorServices',
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
    }

  })

  .controller('SignOutCtrl', function($scope, $rootScope, $localStorage, $timeout, AuthAPI, $window){
    $scope.logout = function(){
      $rootScope.notify("Logging the user out");
      console.log("Logout function activated");
      var token = $localStorage.getToken();
      AuthAPI.signout({token: token})
        .sucess(function(){
          $rootScope.hide();
          $scope.removeProfile();

          $window.location.href = ('#/auth/signin');
          console.log("Signout successful")
        })
        .error(function(error){
            $rootScope.notify("Error logging out: " + error.error);
            console.log("Error loggin out: " + error.error);
        });
    }

    $scope.removeProfile = function(){
      $localStorage.removeProfile();

    }

  })

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $document, RunAPI){

    $scope.startControl = function(startDiv, map){
      var startUI = document.createElement('div');
      startUI.style.backGroundColor = 'white';
      startUI.style.color = '#00b9be';
      startUI.style.border  = '2px solid #00b9be';
      startUI.style.borderRadius = '3px';
      startUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, .3)';
      startUI.style.cursor = 'pointer';
      startUI.style.top = '80%';
      startUI.style.left = '5%';
      startUI.style.right = '5%';
      startUI.style.width = '90%';
      startUI.style.zIndex = '10';
      startUI.style.marginBottom = '22px';
      startUI.style.textAlign = 'center';
      startUI.title = 'Start dreamrun';
      startDiv.appendChild(startUI);

      var startText = document.createElement('div');
      startText.style.color = 'rgb(255, 255, 255)';
      startText.style.fontFamily = 'Helvetica Neue';
      startText.style.fontSize = '16px';
      startText.style.lineHeight = '38px';
      startText.style.paddingLefft = '5px';
      startText.style.paddingRight = '5px';
      startText.style.innerHTML = 'Start DreamRun';
      startUI.appendChild(startText);

      startUI.addEventListener('click', function(){
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
      });

    };
    $scope.mapCreated = function(map){
      $scope.map = map;
      var startControlDiv =  document.createElement('div');
      var startControl = $scope.startControl(startControlDiv, map);


      startControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(startControlDiv);

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

  .controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI){

    CharityAPI.getAll()
      .success(function(data, status, headers, config){
        $rootScope.show("Retrieving our list of charities...");
        console.log("API call getAll succeeded");

        $scope.charityList = [];

        for(var i = 0; i < data.length; i++){
          $scope.list.push(data[i]);
        }
        $scope.select = function(){
          //put code to select charity and pass id to user
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

.controller('MySponsorsCtrl',function($rootScope, $scope, SponsorAPI){

    $rootScope.$on('fetchCompleted', function(){
        SponsorAPI.getAll($rootScope.getToken(),"userId").success(function(data, status, headers, config){
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                $scope.list.push(data[i]);
            };

            if(data.length == 0) {
                $scope.noData = true;
            } else {
                $scope.noData = false;
            }

        }).error(function(data, status, headers, config){
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });

    });


})

.controller('MyPledgesCtrl',function($scope){

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
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

