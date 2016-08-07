/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.runController', ['starter.appServices',
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

//TODO: CLEAR VALUES AFTER RUN SUMMARY, NEW RUN BUTTON?

  .controller('RunCtrl', function($scope, $window, $rootScope, $ionicLoading, $interval, RunAPI, CharityAPI, HistoryAPI, $ionicPopup, AuthAPI, $ionicModal){

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
    console.log('charityName: ' + $scope.charityName);

    if($rootScope.getMoneyRaisedPerMile() != undefined){
      $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();
    } else {
      $scope.moneyRaised = 0;
    }


    console.log('$scope.moneyRaised: ' + $scope.getMoneyRaisedPerMile());


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

        console.log('check runIdDayView: ' + $rootScope.dayRunId);
        $window.location.href=('#/app/historyDay');
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
        var moneyPerMile = $scope.moneyRaised;
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
        $scope.marker = new google.maps.Marker({
          position: currentCoords,
          icon: '../img/blue-gps-tracker.png',
          map: $scope.map

        });
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
      }, 1500);
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
      var currentCoords = $scope.userCoords();
      $scope.polyCoords = [];
      console.log('%cempty poly coords array initialized', 'color: Lime');
      // var drawerTestCoords = {lat: 38.9042049, lng: -77.0473209};
      // $scope.polyCoords.push(drawerTestCoords);
      polyDrawer = $interval(function(){

        currentCoords = $scope.userCoords();
        console.log('%c userCoords called from inside interval in polyDrawer', 'color: Lime');

        // var currentCoords = $scope.getUserCoords();
        // console.log('%c current coords: ' + currentCoords, 'color: Lime');

        $scope.polyCoords.push(currentCoords);
        console.log('%cpoly coords array:' + $scope.polyCoords, 'color: Lime');

        $scope.runPath = new google.maps.Polyline({
          path: $scope.polyCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 6
        });
        $scope.runPath.setMap($scope.map);
        console.log('%crunPath.setMap completed', 'color: Lime');
        console.log('%cexiting Polyline at interval mark', 'color: Lime');
      }, 2000);

    }

    $scope.stopPolyLineDrawer = function(){
      console.log('%ccoordinate retrieval refresher paused', 'color: Lime');
      $interval.cancel(polyDrawer);
      polyDrawer = undefined;
    }

    // $scope.resumePolylineDrawer = function(){
    //   console.log('%cresumePolylineDrawer function activated', 'color: Lime');
    //   $interval.restore(polyDrawer);
    //
    // }


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

        // $scope.marker = new google.maps.Marker({
        //   position: currentCoords,
        //   icon: '../img/PDM logo.png',
        //   map: $scope.map
        //
        // });

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

      $scope.pauseLapTimer();
      // $scope.pauseCoordsArrayUpdater();

      var pausedControlDiv = document.createElement('div');
      var pausedControl = $scope.pausedControl(pausedControlDiv, $scope.map);

      pausedControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(pausedControlDiv);
      $scope.removeLap();
      $scope.removePause();
      $scope.pauseTimer();

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
      $scope.stopPolyLineDrawer();
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
        charityId: $rootScope.getSelectedCharityId(),
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
          console.log('data.id: ' + data._id);
          $rootScope.setRunIdDayView(data._id);

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


  });
