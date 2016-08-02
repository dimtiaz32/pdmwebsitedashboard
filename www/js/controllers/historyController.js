/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.historyController', ['starter.appServices',
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
  'angular-svg-round-progressbar',
  'Tek.progressBar'])




  .controller('HistoryDayCtrl', function($scope, $rootScope, $window, HistoryAPI){

    //Can't get pagination to show
    $scope.slideOptions = {
      pagination: true,
      paginationType: 'bullets'
    };

    // $scope.back = function(){
    //   $window.location.href = ('#/app/history');
    // }



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

    // $rootScope.setValuesForHistoryDayView = function(date, distance, duration, pace, moneyRaised, path, laps){
    //
    //
    //   // $scope.dayUnformattedDisplayDate = date;
    //   $scope.dayDisplayDate = date;
    //   $scope.dayDisplayDistance = distance;
    //   $scope.dayDisplayDuration = duration;
    //   $scope.dayDisplayPace = pace;
    //   $scope.dayDisplayMoneyRaised = moneyRaised;
    //   $scope.dayDisplayPath = path;
    //   $scope.dayDisplayLaps = laps;
    //
    //
    //
    //
    //   console.log('dayDisplayDistance values: ' + $scope.dayDisplayDistance);
    //     //split differently -> lap all one object, lap in laps, lap.number
    //
    //
    //     $scope.historyPolyCoords = [];
    //
    //     $scope.dayLapsForm = [{
    //       number: String,
    //       distance: String,
    //       time: String,
    //       pace: String
    //     }];
    //
    //
    //     console.log('$dayDisplayPath.lat.length: ' + $scope.dayDisplayPath.lat.length);
    //
    //    console.log('setValuesForHistoryDayView: $scope.dayDisplayPath.lat.length: ' + $scope.dayDisplayPath[x].lat.length);
    //    var latSplit = $scope.runDisplayPath.lat.toString().split(',');
    //    var longSplit = $scope.runDisplayPath.long.toString().split(',');
    //    console.log('setValuesForHistoryDayView: latSplit: ' + latSplit[x]);
    //    console.log('setValuesForHistoryDayView: latSplit.length: ' + latSplit.length);
    //    console.log('setValuesForHistoryDayView: longSplit: ' + longSplit);
    //
    //
    //    console.log('$scope.dayDisplayLaps.length: ' + $scope.dayDisplayLaps.length);
    //
    //    //string splitter for laps
    //    var lapNumberSplit = $scope.dayDisplayLaps.number.toString().split(',');
    //    var lapDistancesSplit = $scope.dayDisplayLaps.distance.toString().split(',');
    //    var lapSecondsSplit = $scope.dayDisplayLaps.seconds.toString().split(',');
    //    var lapMinutesSplit = $scope.dayDisplayLaps.minutes.toString().split(',');
    //    var lapPaceSplit = $scope.dayDisplayLaps.pace.toString().split(',');
    //    lapNumberSplit.shift();
    //    lapDistancesSplit.shift();
    //    lapSecondsSplit.shift();
    //    lapMinutesSplit.shift();
    //    lapPaceSplit.shift();
    //
    //
    //
    //     for (var i = 0; i < lapNumberSplit.length; i++) {
    //       console.log('setValuesForHistoryDayView: lapNumberSplit['+i+']: ' + lapNumberSplit[i]);
    //       console.log('setValuesForHistoryDayView: lapDistancesSplit['+i+']: ' + lapDistancesSplit[i]);
    //       console.log('setValuesForHistoryDayView: lapSecondsSplit['+i+']: ' + lapSecondsSplit[i]);
    //       console.log('setValuesForHistoryDayView: lapMinutesSplit['+i+']: ' + lapMinutesSplit[i]);
    //       console.log('setValuesForHistoryDayView: lapPaceSplit['+i+']: ' + lapPaceSplit[i]);
    //
    //       var time = lapMinutesSplit[i] + ':' + lapSecondsSplit[i];
    //       console.log('time: '+ time);
    //
    //       $scope.dayLapsForm.push( {number: lapNumberSplit[i], distance: lapDistancesSplit[i],
    //         time: time,  pace: lapPaceSplit[i]});
    //       console.log('setValuesForHistoryDayView: $scope.dayLaps: ' + $scope.dayLapsForm);
    //       console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.dayLapsForm);
    //
    //     }
    //
    //     console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.dayLapsForm.length);
    //     //
    //     // $scope.distancePopHolder  = [];
    //     // $scope.durationPopHolder = [];
    //     // $scope.pacePopHolder = [];
    //     // $scope.moneyRaisedPopHolder = [];
    //     // $scope.pathPopHolder = [];
    //     // $scope.lapsPopHolder = [];
    //
    //
    //     if(latSplit.length == longSplit.length){
    //       for(var i=0; i< latSplit.length; i++){
    //         var latCoord = latSplit[i];
    //         console.log('setValuesForHistoryDayView: latCoord : ' + latCoord);
    //         var longCoord = longSplit[i];
    //         console.log('setValuesForHistoryDayView: longCoord : ' + longCoord);
    //         var LatLng = new google.maps.LatLng(latCoord, longCoord);
    //         console.log('setValuesForHistoryDayView: LatLng : ' + LatLng);
    //         $scope.historyPolyCoords.push(LatLng);
    //         console.log('setValuesForHistoryDayView: $scope.historyPolycoords: ' + $scope.historyPolyCoords);
    //
    //       }
    //       $scope.historyRunPath = new google.maps.Polyline({
    //         path: $scope.historyPolyCoords,
    //         strokeColor: '#ff0000',
    //         strokeOpacity: 1.0,
    //         strokeWeight: 8
    //       });
    //       $scope.historyRunPath.setMap($scope.map);
    //
    //     } else {
    //       $rootScope.notify("Lat,Lng lengths do not match");
    //       console.log('setValuesForHistoryDayView: lat,long lengths do not match');
    //     }
    // };


    $rootScope.$on('setDayValues', function(){
      console.log('setDayValuesBroadcast entered');
      var date = $rootScope.getDayHistoryValues.date;
      var distance = $rootScope.getDayHistoryValues.distance;
      var duration = $rootScope.getDayHistoryValues.duration;
      var pace = $rootScope.getDayHistoryValues.pace;
      var moneyRaised = $rootScope.getDayHistoryValues.moneyRaised;
      var path = $rootScope.getDayHistoryValues.path;
      var laps = $rootScope.getDayHistoryValues.laps;

      console.log('setDayValues, rootScope returned values of: ' +
        'date: ' + date +
        'distance: ' + distance +
        'duration: ' + duration +
        'pace: ' + pace +
        'moneyRaised: ' + moneyRaised +
        'path: '  + path +
        'laps: ' + laps
      );

    });


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

  .controller('HistoryListCtrl', function ($scope, $rootScope, $window, HistoryAPI, $ionicSlideBoxDelegate, AuthAPI, $filter) {
    //date in mm/dd/yyyy format
    //charity
    //duration
    //distance
    //pace

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
    $scope.listRuns = [{
      id: String,
      Date: String,
      Charity: String,
      Duration: String,
      Distance: Number,
      Pace: Number,
      moneyRaised: Number,
      Path: {lat: [String], long:[String]},
      laps:{
        number: [String],
        distance: [String],
        seconds: [String],
        pace: [String]
      }
    }];
    $scope.listRunsIds = [];
    $scope.listRunsDates = [];
    $scope.listRunsCharities = [];
    $scope.listRunsDurations = [];
    $scope.listRunsDistances = [];
    $scope.listRunsPaces = [];
    $scope.listRunsIds = [];

    $scope.thisDateRunDistance = [];
    $scope.thisDateRunDuration = [];
    $scope.thisDateRunPace = [];
    $scope.thisDateRunMoneyRaised = [];
    $scope.thisDateRunLaps = [];
    $scope.thisDateRunPath = [];

    $scope.listRunsLaps = [];
    $scope.listRunsPaths = [];

    HistoryAPI.getAll($rootScope.getUserId())
      .success(function(data, status, headers, config){

        console.log('History get all API call succeeded');
        for(var i = 0; i< data.length; i++){
          console.log('data['+i+']: '+ data[i]);
          // $scope.listRunsIds.push(data[i]._id);
          // $scope.listRunsDates.push(data[i].date);
          // $scope.listRunsCharities.push(data[i].charities);
          // $scope.listRunsDistances.push(data[i].distances);
          // $scope.listRunsPaces.push(data[i].paces);

          if(data[i].seconds< 10){
            var duration  = data[i].minutes + ':0' + data[i].seconds;
            $scope.listRunsDurations= duration;
            console.log('duration: ' + duration + '$scopeDuration: ' + $scope.listRunsDurations);

          } else {
            var duration  = data[i].minutes + ':' + data[i].seconds;
            $scope.listRunsDurations[i] = duration.toString();
            console.log('duration: ' + duration + '$scopeDuration: ' + $scope.listRunsDurations);
          }
          console.log('duration: ' + duration);



          var dateHolder = data[i].date;

          var dayDatesplit = dateHolder.toString().split('-');
          var monthSplit = dayDatesplit[1];
          var initialDaySplit = dayDatesplit[2];
          var timeSplit = initialDaySplit .toString().split('T');
          var daySplit = timeSplit[0];
          var yearSplit = dayDatesplit[0];

          var date = monthSplit +'/'+daySplit+'/'+yearSplit;

          var charity = data[i].charity.toString();
          var distance = data[i].distance.toString();
          var pace = data[i].pace.toString();
          var laps = data[i].laps;
          var path = data[i].path;
          var moneyRaised = data[i].moneyRaised;
          var id = data[i]._id;
          console.log('laps: ' + laps);
          $scope.listRunsDates.push(date);
          $scope.listRunsCharities.push(charity);
          $scope.listRunsDistances.push(distance);
          $scope.listRunsPaces.push(pace);
          $scope.listRunsLaps.push(laps);




          $scope.listRuns.push({Date: date, Charity:charity,
            Distance: distance, Duration: duration,
            Pace: pace, laps: laps, Path: path, id: id, moneyRaised: moneyRaised});
          console.log('$scope.listRuns['+i+'].date: '+ $scope.listRuns[i].Date);
          console.log('$scope.listRuns['+i+'].charity: '+ $scope.listRuns[i].Charity);
          console.log('$scope.listRuns['+i+'].distance: '+ $scope.listRuns[i].Distance);
          console.log('$scope.listRuns['+i+'].Duration: '+ $scope.listRuns[i].Duration);
          console.log('$scope.listRuns['+i+'].Pace: '+ $scope.listRuns[i].Pace );
          console.log('$scope.listRuns['+i+'].laps: '+ $scope.listRuns[i].laps );
          console.log('$scope.listRuns['+i+'].path: '+ $scope.listRuns[i].Path);
          console.log('$scope.listRuns['+i+'].id: '+ $scope.listRuns[i].id);
          console.log('$scope.listRuns['+i+'].moneyRaised: '+ $scope.listRuns[i].moneyRaised);
        }


      })
      .error(function(err){
        console.log('inside charity get all API call failure');
      });


    $scope.selectedDate = function(date, id){
      console.log('selectedDate entered with date: ' + date);
      console.log('selectedDate entered with id: ' + id);

      $scope.thisDateRunDistance = [];
      $scope.thisDateRunDuration = [];
      $scope.thisDateRunPace = [];
      $scope.thisDateRunMoneyRaised = [];
      $scope.thisDateRunLaps = [];
      $scope.thisDateRunPath = [];

      for(var i=0; i< $scope.listRuns.length; i++){
        if($scope.listRuns[i].id == id){
          console.log('ids matched with values : ' + $scope.listRuns[i].id + '   ' + id);
          console.log('selectedDate: Date and $scope.listRuns[i].Date[i] matched with values: ' + $scope.listRuns[i].Date + ' ' + date);
          // var thisRunDateCoords = [];

          console.log('selectedDate: $scope.distances[i]: ' + $scope.listRuns[i].Distance);
          console.log('selectedDate: $scope.listRuns[i].duration: ' + $scope.listRuns[i].Duration);
          console.log('selectedDate: $scope.pace: ' + $scope.listRuns[i].Pace);
          console.log('selectedDate: $scope.moneyRaised: ' + $scope.listRuns[i].moneyRaised);
          console.log('selectedDate: $scope.paths: ' + $scope.listRuns[i].paths);
          console.log('selectedDate: $scope.laps['+i+']: ' + $scope.listRuns[i].laps);


          $scope.thisDateRunDuration.push($scope.listRuns[i].Duration);
          $scope.thisDateRunDistance.push($scope.listRuns[i].Distance);
          $scope.thisDateRunPace.push($scope.listRuns[i].Pace);
          $scope.thisDateRunMoneyRaised.push($scope.listRuns[i].moneyRaised);
          $scope.thisDateRunPath.push($scope.listRuns[i].Path);
          $scope.thisDateRunLaps.push($scope.listRuns[i].laps);

          console.log('selectedDate: $scope.thisRunDistance: ' + $scope.thisDateRunDistance);
          console.log('selectedDate: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
          console.log('selectedDate: $scope.thisDateRunPace: ' + $scope.thisDateRunPace);
          console.log('selectedDate: $scope.thisDateRunMoneyRaised: ' + $scope.thisDateRunMoneyRaised);
          console.log('selectedDate: $scope.thisDateRunPath: ' + $scope.thisDateRunPath);
          console.log('selectedDate: $scope.thisDateRunLaps: ' + $scope.thisDateRunLaps);


          $rootScope.$broadcast("setDayValues");
        }

      }

      // HistoryAPI.setValuesForDayHistory(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
      //   $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
      //   $scope.thisDateRunPath, $scope.thisDateRunLaps);
      $rootScope.setHistoryDayValues(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
        $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
        $scope.thisDateRunPath, $scope.thisDateRunLaps);

      $window.location.href = ('#/app/historyDay');



    }

  })

  .controller('HistoryCtrl', function($scope, $rootScope, $window, HistoryAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout, $ionicPopup) {

    $scope.viewHistory = function(){

      $window.location.href = ('#/app/historyList');
    };


    //Slider stuffs
    $scope.options = {
      loop: true,
      effect: 'fade',
      speed: 500,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
      console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      // note: the indexes are 0-based
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;
    });


    //progress bar
    //TODO: Set yearlyFunds and yearlyGoal using user's data
    $scope.yearlyFunds = 118;
    $scope.yearlyGoal = 201.60;

    $scope.today = new Date();
    $scope.yearEnd = new Date($scope.today.getFullYear(), 11, 31);
    $scope.yearBegin = new Date(new Date().getFullYear(), 0, 1);
    console.log($scope.yearBegin);

    //one day in millisecs
    $scope.oneDay = 1000*60*60*24;
    $scope.daysInYearTotal = Math.ceil(($scope.yearEnd.getTime() - $scope.yearBegin.getTime())/$scope.oneDay);
    console.log($scope.daysInYearTotal + " Days in 2016");
    $scope.daysLeftInYear = Math.ceil(($scope.yearEnd.getTime() - $scope.today.getTime())/$scope.oneDay);
    console.log($scope.daysLeftInYear + " Days left in the year");

    $scope.yearlyPace = (($scope.daysInYearTotal-$scope.daysLeftInYear)/$scope.daysInYearTotal) * $scope.yearlyGoal;

    $scope.progressVal = 100*($scope.yearlyFunds/$scope.yearlyGoal);
    $scope.paceBunnyVal = 100*($scope.yearlyPace/$scope.yearlyGoal);

    $scope.progressWeekAvg =  7*($scope.yearlyFunds/($scope.daysInYearTotal-$scope.daysLeftInYear));
    console.log($scope.progressWeekAvg);
    $scope.paceBunnyWeekAvg = 7*($scope.yearlyGoal/$scope.daysInYearTotal);
    console.log($scope.paceBunnyWeekAvg);


    //progress circles
    $scope.getColor = function(){
      return '#00b9be';
    }

    $scope.goalDayDistance = 1;
    $scope.currentDayDistance = 1;

    $scope.goalDayFunds = 1;
    $scope.currentDayFunds= .3;

    $scope.goalWeekDistance = 63;
    $scope.currentWeekDistance = 35;

    $scope.goalWeekFunds =100;
    $scope.currentWeekFunds= 130;

    //Change goal popups

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

    $scope.goalPopup = {
      goalDayDistance: "",
      goalDayFunds: "",
      goalWeekDistance: "",
      goalWeekFunds: "",
      goalYearFunds: ""
    }

    $scope.showSetDayGoal = function(){
      var setGoal = $ionicPopup.show({
        template: '<input type="number" ng-model="goalPopup.goalDayDistance" placeholder="{{goalDayDistance}} miles/day" autofocus>'+
                  '<div style="padding: 5px 0;"></div>'+
                  '<input type="number" ng-model="goalPopup.goalDayFunds" placeholder="${{goalDayFunds | number: 2 }}/day">',
        title: 'Change Daily Goals',
        subTitle: 'Enter only numbers',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Set',
            type: 'button-positive',
            onTap: function(e) {
              var goalDayDistance = $scope.goalPopup.goalDayDistance;
              var goalDayFunds = $scope.goalPopup.goalDayFunds;

              $scope.goalPopup.goalDayDistance = "";
              $scope.goalPopup.goalDayFunds = "";

              if (goalDayDistance != "") {
                $scope.goalDayDistance = goalDayDistance;
                console.log('new goal for dist')
              } else {
                console.log('NO new goal for dist')
              }
              if (goalDayFunds != "") {
                $scope.goalDayFunds= goalDayFunds;
                console.log('new goal for funds')
              } else {
                console.log('NO new goal for funds')
              }
            }
          }
        ]
      });
    }



    //graph stuff
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

    // $scope.getNumberOfRuns = function(date){
    //   var counter = 0;
    //   for (var i=0; i< $scope.formattedDates.length; i++){
    //     if(date = $scope.formattedDates[i]){
    //       counter++;
    //       console.log('get number of runs counter: ' + counter);
    //     }
    //   }
    //   console.log('final count for number of runs: ' + counter);
    //   return counter;
    // }

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


    // //sets values for day to pass to historyDayCtrl
    // $scope.setDayValues = function(date){
    //   console.log('Entered setDayValues function with date value: ' + date);
    //   console.log('setDayValues: $scope.formattedDates: ' + $scope.formattedDates);
    //   console.log('setDayValues: $scope.formattedDates.length: ' + $scope.formattedDates.length);
    //
    //   $scope.thisDateRunDistance = [];
    //   $scope.thisDateRunDuration = [];
    //   $scope.thisDateRunPace = [];
    //   $scope.thisDateRunMoneyRaised = [];
    //   $scope.thisDateRunLaps = [];
    //   $scope.thisDateRunPath = [];
    //
    //   var counter = 0;
    //
    //
    //
    //
    //
    //   for(var i =0; i<$scope.formattedDates.length; i++){
    //
    //     if(date == $scope.formattedDates[i]){
    //       // console.log('setDayValues: Date and datesArrayFormatter matched with values of :' + date + ' ' + datesArrayFormatter);
    //       // console.log('setDayValues: number of runs on ' + date + ': ' + counter);
    //       // counter++;
    //
    //       console.log('setDayValues: Date and $scope.formatteddates[i] matched with values: ' + $scope.formattedDates[i] + ' ' + date);
    //       console.log('setDayValues: $scope.distances[i]: ' + $scope.distances[i]);
    //       $scope.thisDateRunDistance.push($scope.distances[i]);
    //       console.log('setDayValues: $scope.thisRunDistance: ' + $scope.thisDateRunDistance);
    //       // var thisRunDateCoords = [];
    //
    //
    //       console.log('setDayValues: $scope.minutes[i]: ' + $scope.minutes[i] + ' $scope.seconds[i]' + $scope.seconds[i]);
    //       if($scope.seconds[i] < 10){
    //         // $scope.thisDateRunDuration = $scope.minutes[i] + ':0' + $scope.seconds[i];
    //         $scope.thisDateRunDuration.push($scope.minutes[i] + ':0' + $scope.seconds[i]);
    //         console.log('setDayValues: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
    //       } else {
    //         $scope.thisDateRunDuration.push($scope.minutes[i] + ':' + $scope.seconds[i]);
    //         console.log('setDayValues: $scope.thisDateRunDuration: ' + $scope.thisDateRunDuration);
    //       }
    //
    //       //
    //
    //       console.log('setDayValues: $scope.pace: ' + $scope.paces[i]);
    //       $scope.thisDateRunPace.push($scope.paces[i]);
    //       console.log('setDayValues: $scope.thisDateRunPace: ' + $scope.thisDateRunPace);
    //
    //       console.log('setDayValues: $scope.moneyRaised: ' + $scope.moneyRaised[i]);
    //       $scope.thisDateRunMoneyRaised.push($scope.moneyRaised[i]);
    //       console.log('setDayValues: $scope.thisDateRunMoneyRaised: ' + $scope.thisDateRunMoneyRaised);
    //
    //       console.log('setDayValues: $scope.paths: ' + $scope.paths[i]);
    //       $scope.thisDateRunPath.push($scope.paths[i]);
    //       console.log('setDayValues: $scope.thisDateRunPath: ' + $scope.thisDateRunPath);
    //
    //       console.log('setDayValues: $scope.laps['+i+']: ' + $scope.laps[i]);
    //       $scope.thisDateRunLaps.push($scope.laps[i]);
    //       console.log('setDayValues: $scope.thisDateRunLaps: ' + $scope.thisDateRunLaps);
    //       counter++;
    //     }
    //
    //
    //   }
    //
    //   $window.location.href = ('#/app/historyDay');
    //   $rootScope.setValuesForHistoryDayView(date, $scope.thisDateRunDistance, $scope.thisDateRunDuration,
    //     $scope.thisDateRunPace, $scope.thisDateRunMoneyRaised,
    //     $scope.thisDateRunPath, $scope.thisDateRunLaps, counter);
    //
    // }

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
  });
