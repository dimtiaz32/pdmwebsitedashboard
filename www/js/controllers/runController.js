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
    $scope.user =  {
      name: ""
    };
    $scope.lat =[];
    $scope.long = [];
    $scope.laps = [];
    $scope.lapDistance = 0;
    $scope.previousLapDistance = 0;
    $scope.lapNumber = 1;
    $scope.lapNumbers = [];
    $scope.lapDistances = [];
    $scope.lapSecs = [];
    $scope.lapMins = [];
    $scope.lapPaces = [];
    $scope.pace = 0;
    $scope.distance = 0;
    $scope.runPath = null;


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
      $scope.mrPerMile = $rootScope.getMoneyRaisedPerMile();
    } else {
      $scope.mrPerMile = 0;
    }


    console.log('$scope.moneyRaised: ' + $scope.getMoneyRaisedPerMile());


    $scope.user.name = $rootScope.getName();

    $scope.isHistoryDetailDisplayed = true;
    $scope.isRunning = false;
    $scope.isPaused = false;

    $scope.toggleRun = function() {
      $scope.isRunning = !$scope.isRunning;
    }

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

      $scope.addStart = function(){
        startDiv.appendChild(startUI);
      }

      startUI.addEventListener('click', function(){



        // $scope.isRunning = !$scope.isRunning;

        console.log('%cStart DreamRun button clicked', 'color: red');

        $scope.toggleRun();

        if(!$scope.map){
          return;
        }
        $scope.startRun();

      });

    };


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


    $scope.mrCalculator = function(distance){
      console.log('mrCalculator entered with distance: ' + distance);
      console.log('moneyRaised: ' + $scope.mrPerMile);
      var totalMr = distance * $scope.mrPerMile;
      console.log('totalMR: ' + totalMr);
      return totalMr;
    }

    var startTimer;
    $scope.seconds = 00;
    $scope.minutes = 00;
    $scope.timer = function(){

      startTimer = $interval(function(){
        if($scope.seconds <60){
          $scope.seconds++;
          if($scope.seconds < 10){
            $scope.seconds = '0' + $scope.seconds;
          }
        } else {
          $scope.minutes++;
          $scope.seconds = 00;
        }
      }, 1000);
      console.log('minutes: ' + $scope.minutes + '  seconds: ' + $scope.seconds);


    }
    $scope.pauseTimer = function(){
      $interval.cancel(startTimer);
      startTimer = undefined;
    }

    $scope.resumeTimer = function(){
      console.log('%cresume timer function activated', 'color: RoyalBlue');
      $scope.timer();
    }

    $scope.stopTimer = function(){
      console.log('%cstop timer function activated', 'color: RoyalBlue');
      $interval.cancel(startTimer);
      startTimer = undefined;

    }

    $scope.paceCalculator = function(distance){
      console.log('paceCalculator entered with distance: ' + distance);
      console.log('pace minutes: ' + $scope.minutes + '  pace seconds: ' + $scope.seconds);
      var pace;
      if (distance == 0){
        pace = 0;

      } else {
        var time = $scope.minutes + ($scope.seconds/60);
        console.log('pace time: ' + time);
        var pace = time/distance;
      }
      return pace;
    }


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

    var lapTimer;
    $scope.lapTimer = function(){
      $scope.lapSeconds = 00;
      $scope.lapMinutes = 0;
      console.log('stopLapTimer: minutes: ' + $scope.lapMinutes + ' seconds: ' + $scope.lapMinutes);
      lapTimer = $interval(function(){
        if($scope.lapSeconds <60){
          $scope.lapSeconds++;
          if($scope.lapSeconds < 10){
            $scope.lapSeconds =  '0' +$scope.lapSeconds;
          }
        } else {
          $scope.lapMinutes++;
          $scope.lapSeconds = 00;
        }
        console.log('lap minutes: ' + $scope.lapMinutes + '  lap seconds: ' + $scope.lapSeconds);
      }, 1000);
      console.log('lap minutes: ' + $scope.lapMinutes + '  lap seconds: ' + $scope.lapSeconds);
    }

    $scope.pauseLapTimer = function(){
      $interval.cancel(lapTimer);
      lapTimer = undefined;
    }

    $scope.resumeLapTimer = function(){
      console.log('%cLap timer resumed', 'color: Blue');
      $scope.lapTimer();
    }

    $scope.stopLapTimer = function(){
      console.log('%cLap timer stopped', 'color: Blue');
      $interval.cancel(lapTimer);
      lapTimer = undefined;

    }
    $scope.getLapPace = function(lapDistance){
      console.log('lapPace calculator entered with distance: ' + lapDistance);
      console.log('lapPace minutes: ' + $scope.lapMinutes + '  lapPaceSeconds: ' + $scope.lapSeconds);
      var lapPace;
      if(lapDistance == 0){
        lapPace = 0;
      } else {
        var lapTime = $scope.lapMinutes + ($scope.lapSeconds/60);
        console.log('pace time: ' + time);
        lapPace = lapTime/lapDistance;
      }
      return lapPace;
    }

    $scope.polyCoords = [];
    $scope.line = [];
    $rootScope.$on('newMap', function(){
      console.log('new map broadCast entered');
      console.log('polyCoords on newMap call: ' + $scope.polyCoords);
      $scope.mapCreated = function(map){
        console.log('mapCreated entered');
        console.log('isRunning load value: ' + $scope.isRunning);
        $scope.polyCoords = [];
        $scope.map = map;
        $scope.onSuccess = function(pos){
          console.log('onSuccess entered with pos: ' + pos);
          $scope.ll = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          console.log('ll: ' + $scope.ll);
          $scope.mapOptions = map.setOptions({
            center: $scope.ll,
            zoom: 18,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          $scope.polyCoords.push($scope.ll);
          $scope.marker = new google.maps.Marker({
            position:$scope.ll,
            icon: '../img/blue-gps-tracker.png'
          });
          if($scope.isRunning  == true){
            $scope.path = null;
            $scope.polyCoords.push($scope.ll);
            console.log('polyCoords: ' + $scope.polyCoords);
            $scope.runPath = new google.maps.Polyline({
              path: $scope.polyCoords,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 6
            });
            var meters = google.maps.geometry.spherical.computeLength($scope.runPath.getPath());
            console.log('meters: ' + meters);
            $scope.distance = meters * 0.000621371;
            console.log('$scope.distance: ' + $scope.distance);
            $scope.runPath.setMap($scope.map);
            $scope.prePath =  $scope.path;
            $scope.removePolyLine = function(){

              if($scope.prePath){
                $scope.runPath.setMap(this.map);
                // $scope.runPath.setMap(null);
              }
              $scope.path = $scope.runPath;
              // $scope.path.setMap(null);
              // $scope.runPath = $scope.path;
            }

            console.log('$scope.distance for lapDistance: ' + $scope.distance);
            console.log('$scope.previousLapDistance: ' + $scope.previousLapDistance);
            $scope.lapDistance = $scope.distance - $scope.previousLapDistance;
            console.log('$scope.lapDistance: ' + $scope.lapDistance);
            $scope.lapPace = $scope.getLapPace($scope.lapDistance);
            console.log('lapPace: ' + $scope.lapPace);


            $scope.pace = $scope.paceCalculator($scope.distance);
            // console.log('pace: ' + $scope.pace);
            $scope.moneyRaised = $scope.mrCalculator($scope.distance);
          }
          $scope.marker.setMap($scope.map);
        }

        $scope.onError = function(){
          console.log('watchPosition onErrror entered');
        }
        $scope.watch = navigator.geolocation.watchPosition($scope.onSuccess, $scope.onError, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
        console.log('watch: ' + JSON.stringify($scope.watch));

        console.log('mapOptions: ' + JSON.stringify($scope.mapOptions));
        var startControlDiv = document.createElement('div');
        var startControl = $scope.startControl(startControlDiv, map);
        startControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(startControlDiv);

        var locateControlDiv = document.createElement('div');
        var locateControl = $scope.locateControl(locateControlDiv, map);

        locateControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locateControlDiv);

      }
    });
    // $scope.mapCreated = function(map){
    //     console.log('isRunning load value: ' + $scope.isRunning);
    //
    //   $scope.map = map;
    //   $scope.onSuccess = function(pos){
    //     console.log('onSuccess entered with pos: ' + pos);
    //     $scope.ll = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //     console.log('ll: ' + $scope.ll);
    //     $scope.mapOptions = map.setOptions({
    //       center: $scope.ll,
    //       zoom: 18,
    //       disableDefaultUI: true,
    //       mapTypeId: google.maps.MapTypeId.ROADMAP
    //     });
    //     $scope.polyCoords.push($scope.ll);
    //     $scope.marker = new google.maps.Marker({
    //       position:$scope.ll,
    //       icon: '../img/blue-gps-tracker.png'
    //     });
    //     if($scope.isRunning  == true){
    //
    //       $scope.path = null;
    //       $scope.polyCoords.push($scope.ll);
    //       console.log('polyCoords: ' + $scope.polyCoords);
    //       $scope.runPath = new google.maps.Polyline({
    //         path: $scope.polyCoords,
    //         strokeColor: '#FF0000',
    //         strokeOpacity: 1.0,
    //         strokeWeight: 6
    //       });
    //       $scope.distance = google.maps.geometry.spherical.computeLength($scope.runPath.getPath());
    //       $scope.runPath.setMap($scope.map);
    //
    //       $scope.removePolyLine = function(){
    //         $scope.prePath =  $scope.path;
    //         if($scope.prePath){
    //           $scope.runPath.setMap(this.map);
    //         }
    //         $scope.path = $scope.runPath;
    //       }
    //
    //       console.log('$scope.distance for lapDistance: ' + $scope.distance);
    //       console.log('$scope.previousLapDistance: ' + $scope.previousLapDistance);
    //       $scope.lapDistance = $scope.distance - $scope.previousLapDistance;
    //       console.log('$scope.lapDistance: ' + $scope.lapDistance);
    //       $scope.lapPace = $scope.getLapPace($scope.lapDistance);
    //       console.log('lapPace: ' + $scope.lapPace);
    //
    //
    //       $scope.pace = $scope.paceCalculator($scope.distance);
    //       // console.log('pace: ' + $scope.pace);
    //       $scope.moneyRaised = $scope.mrCalculator($scope.distance);
    //     }
    //     $scope.marker.setMap($scope.map);
    //   }
    //
    //   $scope.onError = function(){
    //     console.log('watchPosition onErrror entered');
    //   }
    //   $scope.watch = navigator.geolocation.watchPosition($scope.onSuccess, $scope.onError, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
    //   console.log('watch: ' + JSON.stringify($scope.watch));
    //
    //   console.log('mapOptions: ' + JSON.stringify($scope.mapOptions));
    //   var startControlDiv = document.createElement('div');
    //   var startControl = $scope.startControl(startControlDiv, map);
    //   startControlDiv.index = 1;
    //   map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(startControlDiv);
    //
    //   var locateControlDiv = document.createElement('div');
    //   var locateControl = $scope.locateControl(locateControlDiv, map);
    //
    //   locateControlDiv.index = 1;
    //   map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locateControlDiv);
    //
    // }

    $rootScope.$broadcast('newMap');
    $scope.startRun = function(){
      console.log('isRunning: ' + $scope.isRunning);
      $scope.removeStartUI();
      $scope.removeLocateUI();
      $scope.addRepositionedLocateUI();


      $scope.timer();
      $scope.lapTimer();
      var buttonControlDiv = document.createElement('div');
      var buttonControl = $scope.runButtonControl(buttonControlDiv, $scope.map);

      buttonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(buttonControlDiv);
    }


    $scope.lap = function(){
      $scope.stopLapTimer();

      $scope.previousLapDistance = $scope.distance;
      console.log('new lap distance: ' + $scope.previousLapDistance);

      $scope.lapNumbers.push($scope.lapNumber);
      $scope.lapDistances.push($scope.lapDistance);
      $scope.lapSecs.push($scope.lapSeconds);
      $scope.lapMins.push($scope.lapMinutes);
      $scope.lapPaces.push($scope.lapPace);
      console.log('lapNumbers: ' + $scope.lapNumbers);
      console.log('lapDistances: ' + $scope.lapDistances);
      console.log('lapSecs: ' + $scope.lapSecs);
      console.log('lapMins: ' + $scope.lapMins);
      console.log('lapPaces: ' + $scope.lapPaces);

      console.log('lapMinutes: ' + $scope.lapMinutes + '    lapSeconds: ' + $scope.lapSeconds);
      $scope.lapTimer();
      console.log('lapMinutes: ' + $scope.lapMinutes + '    lapSeconds: ' + $scope.lapSeconds);
      $scope.lapNumber++;

    }
    $scope.pauseRun = function(){
      $scope.pauseTimer();

      $scope.pauseLapTimer();
      // $scope.pauseCoordsArrayUpdater();
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
      $scope.resumeTimer();
      $scope.resumeLapTimer();

      $scope.addLap();
      $scope.addPause();
    }


    $scope.resetRun = function(){
      console.log('resetRun entered');

      console.log('resetRun $scope.polyCoords.length: ' + $scope.polyCoords.length);
      console.log('resetRun polyCoords vals pre reset: ' + $scope.polyCoords);
      // for(var i=0; i< $scope.polyCoords.length; i++){
      //   $scope.polyCoords.pop();
      // }

      $scope.polyCoords = [];
      console.log('resetRun polyCoords vals post reset: ' + $scope.polyCoords);
      $scope.runPath = null;
      // $scope.runPath.setMap(null);



      $scope.seconds = 0;
      $scope.minutes = 0;
      $scope.distance = 0;
      $scope.removeStop();
      $scope.removeResume();
      $scope.removeLocateUI();
      // $scope.addStart();
      $scope.toggleRun();
      console.log('isRunning: ' + $scope.isRunning);
      $scope.removePolyLine();

      $rootScope.$broadcast('newMap');
      $scope.mapCreated(this.map);

    }

    $scope.stopRun = function(){
      $scope.runPath.setMap(null);
      navigator.geolocation.clearWatch($scope.watch);
      $scope.lapNumbers.push($scope.lapNumber);
      $scope.lapDistances.push($scope.lapDistance);
      $scope.lapSecs.push($scope.lapSeconds);
      $scope.lapMins.push($scope.lapMinutes);
      $scope.lapPaces.push($scope.lapPace);
      $scope.postRun();
      $scope.stopTimer();
      $scope.stopLapTimer();
      $scope.resetRun();

    };
    $scope.postRun = function(){
      var t = Date.now();
      var today = new Date(t);
      var todaySplit = today.toString().split(' ');
      console.log('t: ' + t + ' today: ' + today + ' todaySplit: ' + todaySplit);
      var runMonth = todaySplit[1];
      console.log('Run month: ' + runMonth);

      console.log('$scope.polyCoords: ' +$scope.polyCoords);

      var coordString = $scope.polyCoords.toString();
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
      console.log('charityId for run post: ' + $rootScope.getSelectedCharityId());
      console.log('charityId for run post: ' + $rootScope.getSelectedCharityName());


      var form = {
        distance: $scope.distance,
        date: Date.now(),
        month: runMonth,
        seconds: $scope.seconds,
        minutes: $scope.minutes,
        pace: $scope.pace,
        User: $rootScope.getUserId(),
        moneyRaised: $scope.moneyRaised,
        charity: $rootScope.getSelectedCharityId(),
        charityName: $rootScope.getSelectedCharityName(),
        path: {lat: [$scope.lat], long: [$scope.long]},
        laps: { number: [$scope.lapNumbers.toString()],
          distance: [$scope.lapDistances.toString()],
          seconds: [$scope.lapSecs.toString()],
          minutes: [$scope.lapMins.toString()],
          pace: [$scope.lapPaces.toString()]
        }
      }

      console.log('form: ' + JSON.stringify(form));
      RunAPI.saveRun(form)
        .success(function(data, status, headers, config){
          //just status header for now
          console.log('saveRun API call returned success');
          console.log('data.id: ' + data._id);
          $rootScope.setRunIdDayView(data._id);
          console.log('$rootScope.dayRunId: ' + $rootScope.dayRunId);
          $window.location.href = ('#/app/historyDay');

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
