/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.historyController', [
  'starter.appController',
  'starter.appServices',
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



  .controller('HistoryCtrl', function($scope, $rootScope, $window, HistoryAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout, $ionicPopup) {




    //Slider stuffs
    $scope.slideOptions = {
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

    $scope.yearlyPace = "";
    $scope.progressVal = "";
    $scope.paceBunnyVal = "";

    $scope.progressWeekAvg =  "";
    $scope.paceBunnyWeekAvg = "";

    $scope.daysLeftInYear = function(){
      var today = new Date();
      console.log('today: ' + today);
      var yearEnd = new Date(today.getFullYear(), 11, 31);
      var yearBegin = new Date(new Date().getFullYear(), 0, 1);
      console.log(yearBegin);

      var oneDay = 1000*60*60*24;

      var daysLeftInYear = Math.ceil((yearEnd.getTime() - today.getTime())/oneDay);
      console.log(daysLeftInYear + " Days left in the year");

      return daysLeftInYear;
    }

    $rootScope.$on('paceBunnySetter', function(){
      $scope.paceBunnySetter = function(){
        $scope.yearlyPace = ((365-$scope.daysLeftInYear())/365) * $scope.yearlyGoal;
        $scope.progressVal = 100*($scope.yearlyFunds/$scope.yearlyGoal);
        $scope.paceBunnyVal = 100*($scope.yearlyPace/$scope.yearlyGoal);

        $scope.progressWeekAvg =  7*($scope.yearlyFunds/(365-$scope.daysLeftInYear()));
        console.log($scope.progressWeekAvg);
        $scope.paceBunnyWeekAvg = 7*($scope.yearlyGoal/365);
        console.log($scope.paceBunnyWeekAvg);
      }
    });

    $rootScope.$broadcast('paceBunnySetter');

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

    $scope.showSetWeekGoal = function(){
      var setGoal = $ionicPopup.show({
        template: '<input type="number" ng-model="goalPopup.goalWeekDistance" placeholder="{{goalWeekDistance}} miles/week" autofocus>'+
        '<div style="padding: 5px 0;"></div>'+
        '<input type="number" ng-model="goalPopup.goalWeekFunds" placeholder="${{goalWeekFunds | number: 2 }}/week">',
        title: 'Change Weekly Goals',
        subTitle: 'Enter only numbers',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Set',
            type: 'button-positive',
            onTap: function(e) {
              var goalWeekDistance = $scope.goalPopup.goalWeekDistance;
              var goalWeekFunds = $scope.goalPopup.goalWeekFunds;

              $scope.goalPopup.goalWeekDistance = "";
              $scope.goalPopup.goalWeekFunds = "";

              if (goalWeekDistance != "") {
                $scope.goalWeekDistance = goalWeekDistance;
                console.log('new goal for dist')
              } else {
                console.log('NO new goal for dist')
              }
              if (goalWeekFunds != "") {
                $scope.goalWeekFunds= goalWeekFunds;
                console.log('new goal for funds')
              } else {
                console.log('NO new goal for funds')
              }
            }
          }
        ]
      });
    }

    $scope.showSetYearGoal = function(){
      var setGoal = $ionicPopup.show({
        template: '<input type="number" ng-model="goalPopup.goalYearFunds" placeholder="${{yearlyGoal | number: 2 }}/year" autofocus>',
        title: 'Change Year Fundraising Goal',
        subTitle: 'Enter only numbers',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Set',
            type: 'button-positive',
            onTap: function(e) {
              var goalYearFunds = $scope.goalPopup.goalYearFunds;

              $scope.goalPopup.goalYearFunds = "";

              if (goalYearFunds != "") {
                $scope.yearlyGoal = goalYearFunds;
                $scope.paceBunnySetter();
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
    $scope.monthDistances = [];
    $scope.monthDates = [];
    // $scope.monthFormattedDatesWithTime = [];
    $scope.monthFormattedDates = [];
    $scope.monthSeconds = [];
    $scope.monthMinutes = [];
    $scope.monthPaces = [];
    $scope.moneyRaised = [];
    $scope.monthPaths = [];
    $scope.monthLaps = [];
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


    $rootScope.$on('fetchMonthHistory', function(){
     console.log('fetchHistoryMonthBroadcast called');
      HistoryAPI.getByMonth($rootScope.getUserId(), todayMonth)
        .success(function(data, status, headers, config) {
          console.log('HistoryAPI getByMonth successfully called');
          for (var i = 0; i < data.length; i++) {
            $scope.monthDistances.push(data[i].distance);
            console.log('$scope.monthDistances[i]: ' + $scope.monthDistances[i]);
            // console.log('$scope.monthDistances: ' + $scope.monthDistances);


            $scope.monthDates.push(data[i].date);
            console.log('$scope.monthDates: ' + $scope.monthDates[i]);

            $scope.monthSeconds.push(data[i].seconds);
            console.log('$scope.monthSeconds: ' + $scope.monthSeconds);

            $scope.monthMinutes.push(data[i].minutes);
            console.log('$scope.monthMinutes: ' + $scope.monthMinutes);

            $scope.monthPaces.push(data[i].pace);
            console.log('$scope.pace: '+ $scope.monthPaces);

            $scope.moneyRaised.push(data[i].moneyRaised);
            console.log('$scope.moneyRaised: ' + $scope.moneyRaised);


            $scope.monthPaths.push(data[i].path);
            console.log('$scope.monthPaths: ' + $scope.monthPaths);
            console.log('$scope.monthPaths['+i+'].lat: ' + $scope.monthPaths[i].lat);
            console.log('$scope.monthPaths['+i+'].long: ' + $scope.monthPaths[i].long);
            for(var x=0; x<$scope.monthPaths.length; x++){
              console.log('$scope.monthPaths['+x+'].lat: ' + $scope.monthPaths[x].lat);
              console.log('$scope.monthPaths['+x+'].long: ' + $scope.monthPaths[x].long);
              console.log('$scope.monthPaths.long: ' + $scope.monthPaths.long);
              console.log('$scope.monthPaths.lat: ' + $scope.monthPaths.lat);
            }
            $scope.monthLaps.push(data[i].laps);
            for(var x=0; x<$scope.monthLaps.length; x++){
              console.log('$scope.monthLaps['+x+'].distance: ' + $scope.monthLaps[x].distance);
              console.log('$scope.monthLaps['+x+'].seconds: ' + $scope.monthLaps[x].seconds);
              console.log('$scope.monthLaps['+x+'].pace: ' + $scope.monthLaps[x].pace);
            }
            // console.log('$scope.monthLaps: ' + $scope.monthLaps);
            // console.log('$scope.monthLaps['+i+'].number: ' + $scope.monthLaps[i].number);


            var formattedDatesWithTime = $scope.monthDates[i];
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
            $scope.monthFormattedDates.push(finalFormattedDate);
            console.log('$scope.monthFormattedDates: ' + $scope.monthFormattedDates);
          }

          console.log('Today value from inside HistoryAPI call: ' + today);
          $scope.getWeekDatesOnLoad();


          console.log('$scope.monthDistanceslength: ' + $scope.monthDistances.length + '$scope.monthDates.length: ' + $scope.monthDates.length);

          var thisMonthTotalDistance = $scope.setMonthTotalDistance($scope.monthDistances);
          console.log('HistoryAPI getByMonth set total distance value as: ' + thisMonthTotalDistance);

          var thisMonthAveragePace = $scope.setMonthAveragePace($scope.monthPaces);
          console.log('HistoryAPI getByMonth set average pace as: ' + thisMonthAveragePace);

          var thisMonthTotalMoneyRaised = $scope.setMonthTotalMoneyRaised($scope.moneyRaised);
          console.log('HistoryAPI getByMonth set total money raised value as: ' + thisMonthTotalMoneyRaised);

          console.log('$scope.monthDates.length: ' + $scope.monthDates.length);

        })
        .error(function(err,status){
          console.log('HistoryAPI getBYMonth returned error: ' + err);
          $rootScope.verifyStatus(status);
        })
        .finally(function(){
          console.log("Refresh Finally~");
          $scope.$broadcast('scroll.refreshComplete');
        });
     });

    $scope.doRefresh = function(fetchType) {
      console.log("fetchType:" + fetchType);
      $rootScope.$broadcast(fetchType);
    };
    $rootScope.$broadcast('fetchMonthHistory');

    // $rootScope.doRefresh(4);


    // })


    $scope.viewHistory = function(){
      $window.location.href=  ('#/app/historyList');

    };


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
      console.log('matchWeekValues: $scope.monthDates: ' +$scope.monthDates);
      console.log('matchWeekValues: $scope.monthDates.length: ' + $scope.monthDates.length);
      console.log('matchWeekValues: $scope.monthFormattedDates: ' +$scope.monthFormattedDates);
      console.log('matchWeekValues: $scope.monthFormattedDates.length: ' + $scope.monthFormattedDates.length);

      console.log('matchWeekValues: $scope.fo')

      var tempDayOneHolder = 0;
      var tempDayTwoHolder = 0;
      var tempDayThreeHolder = 0;
      var tempDayFourHolder = 0;
      var tempDayFiveHolder = 0;
      var tempDaySixHolder = 0;
      var tempDaySevenHolder = 0;


      for(var i=0; i< $scope.monthFormattedDates.length; i++){

        console.log('matchWeekValues: $scope.monthFormattedDates[i]: ' + $scope.monthFormattedDates[i]);

        if(dayOne == $scope.monthFormattedDates[i]){
          console.log('dayOne matched with datesArrayFormatter at day: ' + dayOne + ' ' + $scope.monthFormattedDates[i]);
          tempDayOneHolder = tempDayOneHolder + $scope.monthDistances[i];
          console.log('$scope.monthDistances[i] (dayOne): ' + $scope.monthDistances[i]);
          console.log('tempDayOneHolder: ' + tempDayOneHolder);

        } else if(dayTwo == $scope.monthFormattedDates[i]){
          console.log('dayTwo matched with datesArrayFormatter at day: ' + dayTwo + ' ' + $scope.monthFormattedDates[i]);
          tempDayTwoHolder = tempDayTwoHolder + $scope.monthDistances[i];
          console.log('$scope.monthDistances[i] (dayTwo): ' + $scope.monthDistances[i]);
          console.log('tempDayTwoHolder: ' + tempDayTwoHolder);


        } else if(dayThree == $scope.monthFormattedDates[i]){
          console.log('dayThree matched with datesArrayFormatter at day: ' + dayThree + ' ' + $scope.monthFormattedDates[i]);
          tempDayThreeHolder = tempDayThreeHolder + $scope.monthDistances[i];
          console.log('$scope.monthDistances[i] (dayThree): ' + $scope.monthDistances[i]);
          console.log('tempDayThreeHolder: ' + tempDayThreeHolder);

        }

        else if(dayFour == $scope.monthFormattedDates[i]){
          console.log('dayFour matched with datesArrayFormatter at day: ' + dayFour + ' ' + $scope.monthFormattedDates[i]);
          tempDayFourHolder = tempDayFourHolder + $scope.monthDistances[i];
          console.log('$scope.monthDistances[i] (tempDayFourHolder): ' + $scope.monthDistances[i]);
          console.log('tempDayFourHolder: ' + tempDayFourHolder);

        }

        else if(dayFive == $scope.monthFormattedDates[i]){
          console.log('dayFive matched with datesArrayFormatter at day: ' + dayFive + ' ' + $scope.monthFormattedDates[i]);
          tempDayFiveHolder = tempDayFiveHolder + $scope.monthDistances[i];
          console.log('$scope.monthDistances[i] (dayFive): ' + $scope.monthDistances[i]);
          console.log('tempDayFiveHolder: ' + tempDayFiveHolder);
        }

        else if(daySix == $scope.monthFormattedDates[i]){
          console.log('daySix matched with datesArrayFormatter at day: ' + daySix + ' ' + $scope.monthFormattedDates[i]);
          tempDaySixHolder = tempDaySixHolder + $scope.monthDistances[i];
          console.log('matchWeekValues: $scope.monthDistances[i] (daySix): ' + $scope.monthDistances[i]);
          console.log('tempDaySixHolder ' + tempDaySixHolder);
        }

        else if(daySeven == $scope.monthFormattedDates[i]){
          console.log('daySeven matched with datesArrayFormatter at day: ' + daySeven + ' ' + $scope.monthFormattedDates[i]);
          tempDaySevenHolder = tempDaySevenHolder + $scope.monthDistances[i];
          console.log('matchWeekValues: $scope.monthDistances[i] (daySeven): ' + $scope.monthDistances[i]);

        } else {
          console.log('matchWeekValues: Did not match date: ' + $scope.monthFormattedDates[i] + ' to any of this weeks dates' );
        }

      }


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
