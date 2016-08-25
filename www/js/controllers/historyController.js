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



  .controller('HistoryCtrl', function($scope, $rootScope, $window, HistoryAPI, CharityAPI, $ionicSlideBoxDelegate, AuthAPI, UserAPI, $filter, roundProgressService, $timeout, $ionicPopup) {

  $rootScope.$on('fetchHistory', function(){
    $rootScope.show("Loading History..." );



    //Slider stuffs
    $scope.slideOptions = {
      loop: false,
      speed: 500,
    };

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
    $scope.currentYearFunds = 0;
    $scope.yearlyFunds = 0;
    $scope.yearlyGoal = 0;

    $scope.yearlyPace = "";
    $scope.progressVal = "";
    $scope.paceBunnyVal = "";

    $scope.progressWeekAvg =  "";
    $scope.paceBunnyWeekAvg = "";
    $scope.viewHistory = function(){
      $ionicViewSwitcher.nextDirection('forward');
      $window.location.href=  ('#/app/historyList');
    };


    $scope.daysLeftInYear = function(){
      var today = new Date();
      var yearEnd = new Date(today.getFullYear(), 11, 31);
      var yearBegin = new Date(new Date().getFullYear(), 0, 1);

      var oneDay = 1000*60*60*24;

      var daysLeftInYear = Math.ceil((yearEnd.getTime() - today.getTime())/oneDay);

      return daysLeftInYear;
    }

    $rootScope.$on('paceBunnySetter', function(){

        $scope.yearlyPace = ((365-$scope.daysLeftInYear())/365) * $scope.yearlyGoal;
        $scope.progressVal = 100*($scope.currentYearFunds/$scope.yearlyGoal);
        $scope.paceBunnyVal = 100*($scope.yearlyPace/$scope.yearlyGoal);

        $scope.progressWeekAvg =  7*($scope.currentYearFunds/(365-$scope.daysLeftInYear()));
        $scope.paceBunnyWeekAvg = 7*($scope.yearlyGoal/365);

    });




    //progress circles
    $scope.getColor = function(){
      return '#00b9be';
    }

    $scope.goalDayDistance = 0;
    $scope.currentDayDistance = 0;

    $scope.goalDayFunds = 0;
    $scope.currentDayFunds= 0.00;

    $scope.goalWeekDistance = 0;
    $scope.currentWeekDistance = 0;

    $scope.goalWeekFunds =0;
    $scope.currentWeekFunds= 0.00;






    UserAPI.getGoals($rootScope.getUserId())
      .success(function(data, status, config, headers){
        console.log('UserAPI getGoals function succeeded');
        console.log('getGoals data.length: ' + data.length);
        console.log('weeklyGoals: distance: ' + data.weeklyGoals.distance);
        console.log('weeklyGoals: fundraising: ' + data.weeklyGoals.fundraising);
        console.log('dailyGoals: distance: ' + data.dailyGoals.distance);
        console.log('dailyGoals: fundraising: ' + data.dailyGoals.fundraising);
        console.log('yearChallenge: ' + data.yearGoals.fundraising);
        if(data.yearGoals.fundraising == undefined){
          console.log('data.yearlygoals.fundraising thre undefined');
          $scope.noYearlyGoal = true;
        } else {
          console.log('data.yearlyGoals.fundraising: ' + data.yearGoals.fundraising);
          $scope.yearlyGoal = data.yearGoals.fundraising;
          $scope.noYearlyGoal = false;

        }
        $scope.goalDayDistance = data.dailyGoals.distance;
        $scope.goalDayFunds = data.dailyGoals.fundraising;
        $scope.goalWeekDistance = data.weeklyGoals.fundraising;
        $scope.goalWeekFunds = data.weeklyGoals.distance;

      })
      .error(function(status, err){
        console.log('UserAPI getGoals function failed with status: ' +status + 'and error: ' + err);

      });

    UserAPI.getDayProgress($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('UserAPI call getDayProgress succeeded');
        console.log('getDayProgress data.length: ' + data.length);
        for(var i = 0; i< data.length; i++){
          $scope.currentDayDistance = $scope.currentDayDistance + data[i].distance;
          $scope.currentDayFunds = $scope.currentDayFunds + data[i].moneyRaised;
        }
      })
      .error(function(err, status){
        console.log('UserAPI call getDayProgress failed with error: ' + err + ' and status: ' + status);
      });

    UserAPI.getWeekProgress($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('UserAPI call getWeekProgress succeeded');
        console.log('getWeekProgress data.length: ' + data.length);
        // if(data.length > 1){
          for(var i = 0; i< data.length; i++){
            $scope.currentWeekDistance = $scope.currentWeekDistance + data[i].distance;
            $scope.yearlyFunds = $scope.yearlyFunds + data[i].moneyRaised;
          }
        // }
      })
      .error(function(err, status){
        console.log('UserAPI call getWeekProgress failed with error: ' + err + ' and status: ' + status);
      });

    UserAPI.getYearProgress($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('UserAPI call getYearProgress succeeded');
        console.log('getYearProgress data.length: ' + data.length);
        for(var i = 0; i< data.length; i++){
          console.log('moneyRaised at i: ' + data[i].moneyRaised);
          $scope.currentYearDistance = $scope.currentYearDistance + data[i].distance;
          $scope.currentYearFunds = $scope.currentYearFunds + data[i].moneyRaised;
          console.log('moneyRAised currentYearFunds: ' + $scope.currentYearFunds);
        }
        $rootScope.$broadcast('paceBunnySetter');
        console.log('currrent Year Distance: ' + $scope.currentYearDistance);
        console.log('current Year Funds: ' + $scope.currentYearFunds);
      })
      .error(function(err, status){
        console.log('UserAPI call getYearProgress failed with error: ' + err + ' and status: ' + status);
      });

    //TODO: post yearly challenge, double check top three fetch

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
        template: '<input type="number" min="0" ng-model="goalPopup.goalDayDistance" placeholder="{{goalDayDistance}} miles" autofocus>'+
                  '<div style="padding: 5px 0;"></div>'+
                  '<input type="number" min="0" ng-model="goalPopup.goalDayFunds" placeholder="${{goalDayFunds | number: 2 }}/day">',
        title: 'Change Daily Goals',
        subTitle: 'Enter only numbers',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Set',
            type: 'button-positive',
            onTap: function(e) {
              $rootScope.show('Updating daily goals');
              var gdDistance = $scope.goalPopup.goalDayDistance;
              var gdFunds = $scope.goalPopup.goalDayFunds;

              console.log('gdDistance type: ' + typeof gdDistance);


              if (gdDistance != "" && gdFunds != "") {
                console.log('goalDayDistance: '+ gdDistance + 'goalDayFunds: ' + gdFunds);


                console.log('$scope.goalDayDistance: ' + $scope.goalDayDistance);
                console.log('$scope.goalDayFunds: '+ $scope.goalDayFunds);
                console.log('userId: ' + $rootScope.getUserId());
                var userId = $rootScope.getUserId();
                console.log('userId: ' + userId);
                UserAPI.updateDailyGoals(userId, {fundraising : gdFunds, distance: gdDistance})
                  .success(function(data, status, headers, config){
                    console.log('User API updateDailyGoals call succeeded');
                    $scope.goalDayDistance = gdDistance;
                    $scope.goalDayFunds = gdFunds;
                    $scope.goalPopup.goalDayFunds = "";
                    $scope.goalPopup.goalDayFunds = "";

                    // console.log('data.dailyGoals.fundraising: ' + data.dailyGoals.fundraising);
                    // console.log('data.dailyGoals.distance: ' + data.dailyGoals.distance);

                    $rootScope.hide();
                  })
                  .error(function(status){
                    console.log('UserAPI updateDailyGoals call failed with status: ' + status);
                    $rootScope.hide();
                  });
              } else if(gdDistance == "") {
                console.log('NO new goal for dist');

                var userId = $rootScope.getUserId();
                console.log('userId: ' + userId);
                UserAPI.updateDailyGoals(userId, {fundraising : gdFunds, distance: $scope.goalDayDistance})
                  .success(function(data, status, headers, config){
                    console.log('User API updateDailyGoals call succeeded');
                    $scope.goalDayFunds = gdFunds;
                    $scope.goalPopup.goalDayFunds = "";

                    $rootScope.hide();
                  })
                  .error(function(status){
                    console.log('UserAPI updateDailyGoals call failed with status: ' + status);
                    $rootScope.hide();
                  });


              } else if(gdFunds == ""){
                console.log('No new goal for funds');

                var userId = $rootScope.getUserId();
                console.log('userId: ' + userId);
                UserAPI.updateDailyGoals(userId, {fundraising : $scope.goalDayFunds, distance: gdDistance})
                  .success(function(data, status, headers, config){
                    console.log('User API updateDailyGoals call succeeded');
                    $scope.goalDayDistance = gdDistance;
                    $scope.goalPopup.goalDayDistance = "";

                    $rootScope.hide();
                  })
                  .error(function(status){
                    console.log('UserAPI updateDailyGoals call failed with status: ' + status);
                    $rootScope.hide();
                  });

              }


            }
          }
        ]
      });
    }

    $scope.showSetWeekGoal = function(){
      var setGoal = $ionicPopup.show({
        template: '<input type="number" min="0" ng-model="goalPopup.goalWeekDistance" placeholder="{{goalWeekDistance}} miles/week" autofocus>'+
        '<div style="padding: 5px 0;"></div>'+
        '<input type="number" min="0"ng-model="goalPopup.goalWeekFunds" placeholder="${{goalWeekFunds | number: 2 }}/week">',
        title: 'Change Weekly Goals',
        subTitle: 'Enter only numbers',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Set',
            type: 'button-positive',
            onTap: function(e) {
              var gwDistance = $scope.goalPopup.goalWeekDistance;
              var gwFunds = $scope.goalPopup.goalWeekFunds;

              if (gwDistance != "" && gwFunds != "") {

                var userId = $rootScope.getUserId();
                console.log('userId:  ' + userId);
                $rootScope.show("Updating weekly goals...");
                UserAPI.updateWeeklyGoals(userId, {fundraising: gwFunds, distance: gwDistance})
                  .success(function(data, status, headers, config){
                    console.log('UserAPI updateWeekly goals call succeeded');
                    $scope.goalWeekDistance = gwDistance;
                    $scope.goalWeekFunds = gwFunds;
                    $scope.goalPopup.goalWeekDistance = "";
                    $scope.goalPopup.goalWeekFunds = "";

                    $rootScope.hide();
                  })
                  .error(function(status, err){
                    console.log('UserAPI updateWeekly goals call failed with status: ' + status +
                    'and error: ' + err);
                    $rootScope.hide();
                  });

                console.log('new goal for dist')
              } else if(gwDistance == "") {
                console.log('NO new goal for dist')

                var userId = $rootScope.getUserId();
                console.log('userId: ' + userId);
                UserAPI.updateWeeklyGoals(userId, {fundraising : gwFunds, distance: $scope.goalWeekDistance})
                  .success(function(data, status, headers, config){
                    console.log('User API updateDailyGoals call succeeded');
                    $scope.goalWeekFunds = gwFunds;
                    $scope.goalPopup.goalWeekFunds = "";

                    $rootScope.hide();
                  })
                  .error(function(status){
                    console.log('UserAPI updateDailyGoals call failed with status: ' + status);
                    $rootScope.hide();
                  });

              } else if(gwFunds == ""){

                console.log('No new goal for funds');
                var userId = $rootScope.getUserId();
                console.log('userId: ' + userId);
                UserAPI.updateWeeklyGoals(userId, {fundraising : $scope.goalWeekFunds, distance: gwDistance})
                  .success(function(data, status, headers, config){
                    console.log('User API updateDailyGoals call succeeded');
                    $scope.goalWeekDistance = gwDistance;
                    $scope.goalPopup.goalWeekDistance = "";

                    $rootScope.hide();
                  })
                  .error(function(status){
                    console.log('UserAPI updateDailyGoals call failed with status: ' + status);
                    $rootScope.hide();
                  });


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
              var gyFunds = $scope.goalPopup.goalYearFunds;

              if (gyFunds != undefined || gyFunds != undefined) {
                $scope.yearlyGoal = gyFunds;

                console.log('yearlyGoal: ' + $scope.yearlyGoal);
                UserAPI.updateYearlyGoals($rootScope.getUserId(),{fundraising: $scope.yearlyGoal});
                $rootScope.$broadcast('paceBunnySetter');
                console.log('new goal for funds')
              } else {
                console.log('NO new goal for funds')
              }
            }
          }
        ]
      });
    }



    //graph/chart stuff
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
          boxWidth: 0
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

    $scope.topThree = [];
    $scope.charityOne = {
      name: String,
      moneyRaised: Number,
      id: String
    };
    $scope.charityTwo = {
      name: String,
      moneyRaised: Number,
      id: String
    };
    $scope.charityThree = {
      name: String,
      moneyRaised: Number,
      id: String
    };

    $scope.getCharityName = function(id, moneyRaised){
      $scope.charityNames = [];
      $scope.charityMoneyRaised = [];
      $scope.charityId = [];

      console.log('getCharityName entered with id: ' + id +'   and moneyRaised: ' + moneyRaised);
      CharityAPI.getById(id)
        .success(function(data, status, headers, config){
          console.log('data.name: ' + data.name);
          console.log('moneyRaised: ' + moneyRaised);
          var name = data.name;
          console.log('name name: ' + name);
          $scope.charityNames.push(name);
          $scope.charityMoneyRaised.push(moneyRaised);
          $scope.charityId.push(data._id);
          console.log('charityNames.length: ' + $scope.charityNames.length);
          console.log('charityNames[0]: ' + $scope.charityNames[0]);
          switch($scope.charityNames.length){
            case 1:
              $scope.charityOne = {name: $scope.charityNames[0], moneyRaised: $scope.charityMoneyRaised[0], id: $scope.charityId[0]};
              break;
            case 2:
              $scope.charityTwo = {name: $scope.charityNames[1], moneyRaised: $scope.charityMoneyRaised[1], id: $scope.charityId[1]};
              break;
            case 3:
              $scope.charityThree = {name: $scope.charityNames[2], moneyRaised: $scope.charityMoneyRaised[2], id: $scope.charityId[2]};
              break;
          }

          console.log('charityNames: ' + JSON.stringify($scope.charityNames));
          console.log('charityMoneyRaised: ' + JSON.stringify($scope.charityMoneyRaised));
        })
        .error(function(err, status){
          console.log('getCharityName error: ' + err + ' status: ' + status);
        })


    }

    UserAPI.getTopThreeCharities($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('UserAPI getTopThreeCharities call succeeded');
        console.log('getTopThreeCharities length: ' + data.pastCharities.length);

        // for(var i =0; i< data.pastCharities.length; i++){
        //   $scope.topThree.push(data.pastCharities[i]);
        //   console.log('topThreeCharities: ' + JSON.stringify($scope.topThree));
        //   $scope.getCharityName($scope.topThree[i].id, $scope.topThree[i].moneyRaised);
        //
        // }


        for(var i =0; i< 3; i++){
          $scope.topThree.push(data.pastCharities[i]);

          if($scope.topThree === undefined){
            $scope.hasTopThree = false;
          } else{
            $scope.hasTopThree = true;
            if($scope.topThree[i] == undefined){
              if(i==0){
                $scope.hasCharityOne = false;
                return;
              } else if(i==1){
                $scope.hasCharityTwo = false;
                return;
              } else if(i==2){
                $scope.hasCharityThree =false;
                return;
              }
            } else {
              if(i==0){
                $scope.hasCharityOne = true;
              } else if(i==1){
                $scope.hasCharityTwo = true;
              } else if(i==2){
                $scope.hasCharityThree =true;
              }
              console.log('topThreeCharities: ' + JSON.stringify($scope.topThree));
              $scope.getCharityName($scope.topThree[i].id, $scope.topThree[i].moneyRaised);
            }
          }

        }

      })
      .error(function(err, status){
        console.log('UserAPI getTopThreeCharities call failed with error: ' + err +'  and status: ' + status);
      });

    var today = new Date();
    today.setDate(today.getDate());
    console.log('today: ' + today);
    var d1 = new Date();
    var d2 = new Date();
    var d3 = new Date();
    var d4 = new Date();
    var d5 = new Date();
    var d6 = new Date();
    var d7 = new Date();
    var dm1 = new Date();
    var dm2 = new Date();
    var dm3 = new Date();
    var dm4 = new Date();
    var dm5 = new Date();
    var dm6 = new Date();
    var dm7 = new Date();

    d1.setDate(d1.getDate());
    d2.setDate(d2.getDate() - 1);
    d3.setDate(d3.getDate() - 2);
    d4.setDate(d4.getDate() - 3);
    d5.setDate(d5.getDate() - 4);
    d6.setDate(d6.getDate() - 5);
    d7.setDate(d7.getDate() - 6);
    console.log('d1: ' + d1 + '  d2:' + d2 + '  d3:' + d3 + '  d4:' + d4 + '  d5:' + d5 + '  d6:' + d6 +
      '  d7:' + d7);

    $scope.labelsNotForDisplay = [d1, d2, d3, d4, d5, d6, d7];

    dm1.setMonth(d1.getMonth()+1);
    dm2.setMonth(d2.getMonth()+1);
    dm3.setMonth(d3.getMonth()+1);
    dm4.setMonth(d4.getMonth()+1);
    dm5.setMonth(d5.getMonth()+1);
    dm6.setMonth(d6.getMonth()+1);
    dm7.setMonth(d7.getMonth()+1);
    console.log('dm1: ' + dm1);

    var df1 = dm1.getMonth() +'/' + d1.getDate();
    var df2 = dm2.getMonth() +'/' + d2.getDate();
    var df3 = dm3.getMonth() +'/' + d3.getDate();
    var df4 = dm4.getMonth() +'/' + d4.getDate();
    var df5 = dm5.getMonth() +'/' + d5.getDate();
    var df6 = dm6.getMonth() +'/' + d6.getDate();
    var df7 = dm7.getMonth() +'/' + d7.getDate();
    console.log('df1: ' + df1);
    //sorted from recent to last on server


    $scope.removeTimeSplit = function(date){
      console.log('removeTime split entered with date: ' + date);
      var splitOne = date.toString().split('T');
      var formattedDate = splitOne[0];
      console.log('formatted date: '  + formattedDate);
      return formattedDate;
    };

    //removes time from label and returns in JSON format
    $scope.labelTimeSplit = function(date){
      console.log('entered with date: ' + date);
      var jsonLabel = date.toJSON();
      console.log('jsonlabel: ' + jsonLabel);
      var newLabel = $scope.removeTimeSplit(jsonLabel);
      console.log('newLabel: ' + newLabel);
      return newLabel;
    }

    $scope.weekHistory = [];
    $scope.dates = [];
    $scope.distances = [];
    $scope.distanceByDate = [];
    // $rootScope.show("Loading week history...");
    console.log('userId: ' + $rootScope.getUserId());
    HistoryAPI.getByWeek($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('HistoryAPI getby week call succeeded');
        console.log('getByWeek data.length: data.length: ' + data.length);
        for(var i=0; i< data.length; i++){
          $scope.weekHistory.push(data[i]);
          console.log('data['+i+'].date: ' + data[i].date);
          $scope.dates.push(data[i].date);
          $scope.distances.push(data[i].distance);
          // $scope.dates
        }

          console.log('labels: ' + df7 + " " + df6 + " " + df5 + " " + df4 + " " + df3 + " " + df2 + " " + df1 + " ");
          $scope.labels = [df7, df6, df5, df4, df3, df2, df1];
          $scope.series = ['Miles Run'];



        console.log('weekHistory: ' + JSON.stringify($scope.weekHistory));
        console.log('distances: ' + JSON.stringify($scope.distances));
        console.log('dates: ' + JSON.stringify($scope.dates));

        $scope.matchDates = function(date){
          // for(var i=0; i< $scope.dates.length; i++){
          console.log('matchDates entered with date: ' + date);
            console.log('$scope.weekHistory['+i+']:.date' + $scope.weekHistory[i].date);
            if(date == $scope.weekHistory[i].date){
              console.log('dates matches with: ' + date + '   ' +$scope.weekHistory[i].date);
              console.log('$scope.weekHistory[+'+i+'].distance: ' + $scope.weekHistory[i].distance);
              if($scope.weekHistory[i].distance != undefined){
                console.log('matchDates distance: ' +$scope.weekHistory[i].distance);
                return $scope.weekHistory[i].distance;
              } else {
                return 0;
              }
            } else {
              return 0;
            }
          }
        // }

        $scope.matchDateToLabel = function(date){
          console.log('matchDateToLabel entered with date: ' + date);
          var fDate = $scope.removeTimeSplit(date);
          for(var i=0; i< 7; i++){
            console.log('$scope.labelsNotForDisplay: ' + $scope.labelsNotForDisplay[i]);
            var label = $scope.labelTimeSplit($scope.labelsNotForDisplay[i]);
            console.log('label: ' + label + ' fDate: ' + fDate );
            if(fDate == label){
              console.log('matched date to label with values: ' + fDate + '    ' + label);
              console.log('i: ' + i);
              return i;
            } else {
              console.log('fDate did not match label');
            }
          }
        }

        for(var i=0; i< $scope.dates.length; i++){
          console.log('$scope.dates['+i+']: ' + $scope.dates[i]);
          var distance = $scope.matchDates($scope.dates[i]);
          var position = $scope.matchDateToLabel($scope.dates[i]);
          console.log('distance: ' + distance +'   at array position:' + position);
          if(position != undefined){
            if($scope.distanceByDate[position] == undefined){
              $scope.distanceByDate[position] = distance;
              console.log('$scope.distanceByDate['+position+']: ' + $scope.distanceByDate[position]);
            } else {
              $scope.distanceByDate[position] = distance +  $scope.distanceByDate[position];
              console.log('$scope.distanceByDate['+position+']: ' + $scope.distanceByDate[position]);
            }
          } else {
            console.log('position undefined: ' + position);
          }
        }

        $scope.data = [[
          $scope.distanceByDate[6],
          $scope.distanceByDate[5],
          $scope.distanceByDate[4],
          $scope.distanceByDate[3],
          $scope.distanceByDate[2],
          $scope.distanceByDate[1],
          $scope.distanceByDate[0]
        ]];
        $rootScope.hide();

      })
      .error(function(status, err){
        console.log('HistoryAPI getby week call failed with error: ' + err + 'and status: ' + status);
        $rootScope.hide();
      });

    console.log('$scope.data: ' + JSON.stringify($scope.data));

    $scope.viewHistory = function(){
      $window.location.href=  ('#/app/historyList');

    };

    $scope.series = ['Series A'];
  });
    $rootScope.$broadcast('fetchHistory');

  });
