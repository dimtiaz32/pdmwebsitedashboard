
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

  .controller('RunCtrl', function($scope, $cordovaBackgroundGeolocation, $window, $rootScope,$ionicPlatform, $cordovaGeolocation,  $ionicLoading,$ionicPopup, $interval, AppAPI, UserAPI, RunAPI, CharityAPI, HistoryAPI, DonationAPI, $timeout, $ionicModal){

  $rootScope.$on('initRun', function(){




    $rootScope.$on('LoadRun', function(){
      $scope.name = $rootScope.getName();
      $scope.charityName = $rootScope.getSelectedCharityName();
      $rootScope.$broadcast('fetchMyPledges');
      $scope.$broadcast('scroll.refreshComplete');
    });


    $rootScope.$on('ChangeCharity', function(){
      $scope.charityName = $rootScope.getSelectedCharityName();
      $scope.$broadcast('scroll.refreshComplete');
    });

    // $scope.charityName = $rootScope.getSelectedCharityName();
    $rootScope.$broadcast('LoadRun');
    $rootScope.$broadcast('ChangeCharity');

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
    $scope.marker;

    $scope.isDetailDisplayed = false;
    $scope.isRunDetailDisplayed = false;



    $scope.hasCharity = function(){
      if($rootScope.getSelectedCharityId() != undefined && $rootScope.getSelectedCharityId() != null){
        console.log('has charity is true');
        return true;
      } else {
        return false;
      }
    }

    DonationAPI.getAllSponsors($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('Donation API getAllSponsors from run controller succeeded');
        console.log('data.length: ' + data.length);
        if(data.length > 0){
          $scope.noSponsor = false;
        } else {
          $scope.noSponsor = true;
        }
      })
      .error(function(err, status){
        console.log('Donation API getAllSponsors from run controller failed with error: ' + err + '   and status: ' + status);
      })


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
      console.log("toggle Detail");
      $scope.isDetailDisplayed = !$scope.isDetailDisplayed;
    };

    $scope.toggleRunDetail = function() {
      console.log("toggle run detail");
      $scope.isRunDetailDisplayed = !$scope.isRunDetailDisplayed;
    };


    $rootScope.$on('fetchMoneyRaisedPerMile', function() {
      if($rootScope.getMoneyRaisedPerMile() != undefined){
        $scope.mrPerMile = $rootScope.getMoneyRaisedPerMile();
        console.log('amount raised per mile: ' + $scope.mrPerMile);
        $rootScope.$broadcast('scroll.refreshComplete');
      } else {
        $scope.mrPerMile = 0;
        $rootScope.$broadcast('scroll.refreshComplete');
      }
    });

    $rootScope.$broadcast('fetchMoneyRaisedPerMile');

    console.log('$scope.moneyRaised: ' + $scope.getMoneyRaisedPerMile());




    $scope.isHistoryDetailDisplayed = true;
    $scope.isRunning = false;
    $scope.isPaused = false;

    $scope.toggleRun = function() {
      $scope.isRunning = !$scope.isRunning;
      console.log('toggled run value: ' + $scope.isRunning);
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
                $scope.stopRun();

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
      startUI.style.left = '50%';
      startUI.style.transform = 'translate(-50%,0)';


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

    $rootScope.$on('runWeekMoneyRaised', function() {
      //week & month moneyRaised && distance
      HistoryAPI.getWeekMoneyRaised($rootScope.getUserId())
        .success(function (data, status, headers, config) {
          console.log('historyAPI getWeekMoneyRaised call succeeded: (data): ' + JSON.stringify(data));
          console.log('getWeekMoneyRaised data.length: ' + data.length);

          $scope.weekDist = 0;
          $scope.weekMr = 0;
          for (var i = 0; i < data.length; i++) {
            $scope.weekMr = $scope.weekMr + data[i].moneyRaised;
            $scope.weekDist = $scope.weekDist + data[i].distance;
            console.log('$scope.weekMr: ' + $scope.weekMr);
            console.log('$scope.weekDist: ' + $scope.weekDist);
          }
          console.log('final $scope.weekMr: ' + $scope.weekMr);
          console.log('final $scope.weekDist: ' + $scope.weekDist);
        })
        .error(function (err, status) {
          console.log('historyAPI getWeekMoneyRaised call failed with error: ' + err + '   and status: ' + status);
        }).finally(function(){
          console.log("Refresh Finally~");
          $scope.$broadcast('scroll.refreshComplete');
      });
      console.log("--------end runWeekMoneyRaised---------");
    });

    $rootScope.$on('runMonthMoneyRaised', function(){
      HistoryAPI.getMonthMoneyRaised($rootScope.getUserId())
        .success(function(data, status, headers, config){
          console.log('historyAPI getMonthMoneyRaised call succeeded: (data): ' + JSON.stringify(data));
          console.log('getMonthMoneyRaised data.length: ' + data.length);

          $scope.monthDist = 0;
          $scope.monthMr = 0;
          for(var i = 0; i< data.length; i++){
            $scope.monthMr = $scope.monthMr + data[i].moneyRaised;
            $scope.monthDist = $scope.monthDist + data[i].distance;
            console.log('$scope.monthMr: ' + $scope.monthMr);
            console.log('$scope.monthDist: ' + $scope.monthDist);
          }
          console.log('final $scope.monthMr: ' + $scope.monthMr);
          console.log('final $scope.monthDist: ' + $scope.monthDist);
        })
        .error(function(err, status){
          console.log('historyAPI getWeekMoneyRaised call failed with error: ' + err + '   and status: ' + status);
        }).finally(function(){
          console.log("Refresh Finally~");
          $scope.$broadcast('scroll.refreshComplete');
      });

      console.log("--------end runMonthMoneyRaised---------");
    });

    $rootScope.$broadcast('runMonthMoneyRaised');
    $rootScope.$broadcast('runWeekMoneyRaised');


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
        locateUI.style.left = '61vw';
        locateDiv.appendChild(locateUI);
      }

      $scope.addRepositionedLocateUI = function(){
        locateUI.style.position = 'absolute';
        locateUI.style.bottom = '170px';
        locateUI.style.left = '61vw';
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
    $scope.seconds = 0;
    $scope.minutes = 00;
    $scope.timer = function(){

      startTimer = $interval(function(){
        if($scope.seconds <59){
          $scope.seconds++;
          if($scope.seconds < 10){
            $scope.seconds = '0' + $scope.seconds;
          }
        }
         else {
          $scope.minutes++;
          $scope.seconds = '0'+0;
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

      if (i == 0 || i % 2 == 0) {
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
        if($scope.lapSeconds <60 || $scope.lapSeconds ==0){
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
        console.log('pace time: ' + lapTime);
        lapPace = lapTime/lapDistance;
      }
      return lapPace;
    }

    $scope.polyCoords = [];
    $scope.line = [];

    // $scope.marker = new google.maps.Marker({
    //   // icon: '../img/blue-gps-tracker.png'
    //   icon: {
    //     path: google.maps.SymbolPath.CIRCLE,
    //     scale: 10,
    //     fillOpacity: 1,
    //     fillColor: '#00b9be',
    //     strokeOpacity: 1,
    //     strokeColor: '#fff',
    //     strokeWeight: 2,
    //   }
    // });

    $scope.oldZoom = 18;

    $scope.getCustomRadiusForZoom = function(zoomLevel){
      console.log('getCustomRadius entered with zoomLevel: ' + zoomLevel);
      var newRadius = 0;
      switch(zoomLevel){
        case 0:
          newRadius = 5*Math.pow(2,18);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 1:
          newRadius = 5*Math.pow(2,17);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 2:
          newRadius = 5*Math.pow(2,16);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 3:
          newRadius = 5*Math.pow(2,15);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 4:
          newRadius = 5*Math.pow(2,14);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 5:
          newRadius = 5*Math.pow(2,13);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 6:
          newRadius = 5*Math.pow(2,12);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 7:
          newRadius = 5*Math.pow(2,11);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 8:
          newRadius = 5*Math.pow(2,10);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 9:
          newRadius = 5*Math.pow(2,9);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 10:
          newRadius = 5*Math.pow(2,8);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 11:
          newRadius = 5*Math.pow(2,7);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 12:
          newRadius = 5*Math.pow(2,6);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 13:
          newRadius =newRadius = 5*Math.pow(2,5);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 14:
          newRadius = 5*Math.pow(2,4);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 15:
          newRadius = 5*(Math.pow(2,3));
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 16:
          newRadius = 5*(Math.pow(2, 2));
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 17:
          newRadius = 5*2;
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 18:
          newRadius = 5;
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 19:
          newRadius = 5-(1.25 *1);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 20:
          newRadius = 5-(1.25 *2);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 21:
          newRadius = 5-(1.25*3);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 22:
          newRadius = 5-(0.5*4);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
        case 23:
          newRadius = 5-(0.5*5);
          console.log('newRadius: ' + newRadius);
           return newRadius;;
      };


      // return newRadius;
    }


    $rootScope.$on('newMap', function(){
      console.log('new map broadCast entered');
      console.log('polyCoords on newMap call: ' + $scope.polyCoords);

      $scope.mapCreated = function(map){
        console.log('mapCreated entered');
        console.log('isRunning load value: ' + $scope.isRunning);
        // $scope.polyCoords = null;

        $scope.map = map;
        $scope.circle = new google.maps.Circle({
          fillOpacity: 1,
          fillColor: '#00b9be',
          strokeOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
          radius: 5,
          zIndex: 2
        });

        $scope.mapOptions = $scope.map.setOptions({
          zoom: 18,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        $scope.polyCoords = [];
        $scope.locationSource = 'foreground';

        $scope.onSuccess = function(pos){
          console.log('onSuccess entered with pos: ' + pos);
          $rootScope.hide();
          if($scope.locationSource == 'background'){
            $scope.ll =new google.maps.LatLng(pos.Location.coords.latitude, pos.Location.coords.longitude);
          }
          $scope.ll = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          console.log('ll: ' + $scope.ll);
          // $scope.marker.setPosition($scope.ll);

          $scope.map.panTo($scope.ll);
          $scope.map.setCenter($scope.ll);

          // google.maps.event.addListener($scope.map, 'zoom_changed', function(){
          //   var zoomLevel = $scope.map.getZoom();
          //   // var circleRadius = $scope.circle.getRadius();
          //   $scope.circle.setRadius($scope.getCustomRadiusForZoom(zoomLevel));
          // });

          $scope.circle.setMap($scope.map);
          $scope.circle.setCenter($scope.ll);

          if($scope.isRunning  == true){
            $scope.path = null;
            $scope.polyCoords.push($scope.ll);
            console.log('polyCoords: ' + $scope.polyCoords);
            $scope.runPath.setPath($scope.polyCoords);

            var meters = google.maps.geometry.spherical.computeLength($scope.runPath.getPath());
            console.log('meters: ' + meters);
            $scope.distance = meters * 0.000621371;
            console.log('$scope.distance: ' + $scope.distance);
            $scope.runPath.setMap($scope.map);


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

          // $scope.marker.setMap($scope.map);

          // $scope.prePath =  $scope.path;
          $scope.removePolyLine = function(){

            if($scope.prePath){
              $scope.runPath.setMap(this.map);
              // $scope.runPath.setMap(null);
            }
            $scope.path = $scope.runPath;
            // $scope.path.setMap(null);
            // $scope.runPath = $scope.path;
          }
          $scope.centerOnMe = function(){
            $rootScope.show('Centering Map...');
            console.log("%cCentering", 'color: Green');
            if(!$scope.map){
              return;
            }

            $scope.loading = $ionicLoading.show({
              content: 'Getting current location',
              showBackdrop: false
            });
            if($scope.ll != undefined){
              $scope.map.setCenter($scope.ll);
            }

            $rootScope.hide();
          };
          $rootScope.hide();
          $rootScope.$broadcast('scroll.refreshComplete');
        }
        $scope.map.addListener('zoom_changed', function(){
          var zoomLevel = $scope.map.getZoom();
          // var circleRadius = $scope.circle.getRadius();
          $scope.circle.setRadius($scope.getCustomRadiusForZoom(zoomLevel));
        });

        $scope.watchRetry = function(){
          console.log('attempting watchRetry...');
          $rootScope.show("Finding your location...");
          // if($scope.ll !== undefined){
          //
          // }

          // if($scope.isRunning == true){}
            console.log('$scope.ll: ' + $scope.ll);
            if($scope.ll != undefined){

              $scope.map.setCenter($scope.ll);
              $scope.circle.setCenter($scope.ll);
            }

            $scope.circle.setMap($scope.map);

        }

        $scope.onError = function(){
          console.log('watchPosition onErrror entered');
          $scope.watchRetry();

        }


        $rootScope.$on('resetWatch', function(){

          $ionicPlatform.ready(function(){

            if(window.BackgroundGeolocation) {
              $scope.bgGeo = window.BackgroundGeolocation;
              //This callback will be executed every time a geolocation is recorded in the background.
              var callbackFn = function (location, taskId) {
                var coords = location.coords;
                var lat = coords.latitude;
                var lng = coords.longitude;
                console.log('- Location: ', JSON.stringify(location));

                console.log('location called from BackgroundGeolocation');
                $scope.watch = window.BackgroundGeolocation.getCurrentPosition($scope.onSuccess, $scope.onError, {maximumAge: 3000, timeout: 3000, enableHighAccuracy: true});
                // Must signal completion of your callbackFn.
                $scope.bgGeo.finish(taskId);
              };

              // This callback will be executed if a location-error occurs.  Eg: this will be called if user disables location-services.
              var failureFn = function (errorCode) {
                console.warn('- BackgroundGeoLocation error: ', errorCode);
              }

              // Listen to location events & errors.
              $scope.bgGeo.on('location', callbackFn, failureFn);

              // Fired whenever state changes from moving->stationary or vice-versa.
              $scope.bgGeo.on('motionchange', function (isMoving) {
                console.log('- onMotionChange: ', isMoving);
              });

              // BackgroundGeoLocation is highly configurable.
              $scope.bgGeo.configure({
                // Geolocation config
                desiredAccuracy: 0,
                distanceFilter: 10,
                stationaryRadius: 50,
                locationUpdateInterval: 1000,
                fastestLocationUpdateInterval: 5000,

                // Activity Recognition config
                activityType: 'AutomotiveNavigation',
                activityRecognitionInterval: 5000,
                stopTimeout: 5,

                // Application config
                debug: true,
                stopOnTerminate: false,
                startOnBoot: true,

                // HTTP / SQLite config
                url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
                method: 'POST',
                autoSync: true,
                maxDaysToPersist: 1,
                headers: {
                  "X-FOO": "bar"
                },
                params: {
                  "auth_token": "maybe_your_server_authenticates_via_token_YES?"
                }
              }, function (state) {
                // This callback is executed when the plugin is ready to use.
                console.log('BackgroundGeolocation ready: ', state);
                if (!state.enabled) {
                  $scope.bgGeo.start();
                }
              });

              // The plugin is typically toggled with some button on your UI.

            } else {
              $scope.watch = navigator.geolocation.watchPosition($scope.onSuccess, $scope.onError, {maximumAge: 3000, timeout: 3000, enableHighAccuracy: true});
            }
          });


        });
        $rootScope.$broadcast('resetWatch');

        console.log('watch JSON: ' + JSON.stringify($scope.watch));
        console.log('watch: ' + $scope.watch);

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


    $rootScope.$broadcast('newMap');


    $scope.startRun = function(){
      console.log('isRunning: ' + $scope.isRunning);
      $rootScope.$broadcast('hideTabBar');

      $scope.removeStartUI();
      $scope.removeLocateUI();
      $scope.addRepositionedLocateUI();
      $scope.runPath = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 10,
        zIndex: 1
      });

      $scope.timer();
      $scope.lapTimer();
      var buttonControlDiv = document.createElement('div');
      var buttonControl = $scope.runButtonControl(buttonControlDiv, $scope.map);

      buttonControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.BOTTOM].push(buttonControlDiv);
    }


    $scope.lap = function(){

      //lap number display toggle
      // $scope.popupToggleLap=true;
      // $timeout(function(){
      //   $scope.popupToggleLap=false
      // }, 1250);


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
      $scope.pauseLapTimer();
      $scope.pauseTimer();
      // $scope.pauseCoordsArrayUpdater();
      $scope.removeLap();
      $scope.removePause();


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

      $scope.polyCoords = null;
      console.log('resetRun polyCoords vals post reset: ' + $scope.polyCoords);
      $scope.runPath = null;



      // $scope.runPath.setMap(null);
      // $scope.polyCoords.setMap(null);


      $scope.seconds = 0;
      $scope.minutes = 0;
      $scope.distance = 0;
      $scope.removeStop();
      $scope.removeResume();
      $scope.removeLocateUI();
      // $scope.addStart();
      $scope.toggleRun();
      console.log('isRunning: ' + $scope.isRunning);

      $scope.mapCreated(this.map);
      $scope.removePolyLine();

    }

    $scope.stopRun = function(){

      $rootScope.$broadcast('showTabBar');

      $scope.lapNumbers.push($scope.lapNumber);
      $scope.lapDistances.push($scope.lapDistance);
      $scope.lapSecs.push($scope.lapSeconds);
      $scope.lapMins.push($scope.lapMinutes);
      $scope.lapPaces.push($scope.lapPace);
      $scope.runPath.setMap(null);
      $scope.circle.setMap(null);
      navigator.geolocation.clearWatch($scope.watch);
      $scope.postRun();
      $scope.stopTimer();
      $scope.resetRun();
      $scope.$broadcast('newMap');
      $rootScope.hide();

    };
    $scope.postRun = function(){
      var t = Date.now();
      var today = new Date(t);
      var todaySplit = today.toString().split(' ');
      console.log('t: ' + t + ' today: ' + today + ' todaySplit: ' + todaySplit);
      var runMonth = todaySplit[1];
      console.log('Run month: ' + runMonth);
      $scope.long = [];
      $scope.lat = [];

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


          UserAPI.updatePastCharities({
            userId: $rootScope.getUserId(),
            charityId: $rootScope.getSelectedCharityId(),
            moneyRaised: form.moneyRaised
          })
            .success(function(data, status, headers, config){
              console.log('UserAPI updatePastCharitiesMoney succeeded with charity: ' +data.charity +' and amount: ' + data.moneyRaised);

            })
            .error(function(status, err) {
              console.log('UserAPI updatePastCharitiesMoney failed with err: ' + err + ' and status: ' + status);

            });

          $rootScope.$broadcast('setDayHistory');
          $window.location.href = ('#/app/historyDay');

        })
        .error(function(err,status){
          console.log(err);
          console.log('Save run API call failed');
          $rootScope.verifyStatus(status);
        });

    }




  });

    // $ionicPlatform.ready(function(){
        $rootScope.$broadcast('initRun');
    // });
    $rootScope.$on('destroyWatch',function(){
      navigator.geolocation.clearWatch($scope.watch);
      $rootScope.hide();
    });
    $rootScope.$on('restoreWatch', function(){
      $scope.watch = undefined;
    })
  });
