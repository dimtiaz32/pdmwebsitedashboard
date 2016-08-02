/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.appController', ['starter.appServices',
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


  .controller('AppCtrl', function($rootScope, $scope, $window, $filter, $ionicModal, $timeout, DonationAPI, CharityAPI, AuthAPI, $ionicNavBarDelegate) {

    // $ionicNavBarDelegate.showBackButton(false)


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
      DonationAPI.getAllSponsors($rootScope.getUserId()).success(function(data, status, headers, config){
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

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });

    $rootScope.$on('fetchMyPledges',function(){
      DonationAPI.getAllPledges($rootScope.getUserId()).success(function(data, status, headers, config){
        $scope.pledges = [];
        for (var i = 0; i < data.length; i++) {
          $scope.pledges.push(data[i]);
        };

        if(data.length == 0) {
          $scope.noPledge = true;
        } else {
          $scope.noPledge = false;
        }

      }).error(function(err, status){
        console.log("Refresh Error: " + err);
        $rootScope.verifyStatus(status);
        $rootScope.notify("Oops something went wrong!! Please try again later");
      }).finally(function(){
        console.log("Refresh Finally~");
        $scope.$broadcast('scroll.refreshComplete');
      });
    });


    //history stuff
    var t = Date.now();
    var today = new Date(t);

    console.log('Today: ' +today );
    var utcToday= new Date(today.toUTCString());
    console.log('Today: ' + today + ' Converts to UTC string: ' + utcToday);
    var isoToday = new Date(today.toISOString());
    console.log('Today: ' + today + 'Converts to Iso string: ' + isoToday);
    var todaySplit = today.toString().split(' ');
    var todayMonth = todaySplit[1];
    console.log('Today month: '  + todayMonth);

    $scope.fetchMonthHistory = function(){
      $rootScope.$broadcast('fetchMonthHistory');
    }

    //log out
    $scope.logout = function() {
      $rootScope.clearAll();
      $rootScope.$broadcast('destroy');
      $window.location.href = "#/auth/signin";
    }

  })



  .controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, HistoryAPI, AuthAPI){

    $scope.isDetailDisplayed = false;
    $scope.charityName  = $rootScope.getSelectedCharityName();
    $scope.charityDescription = $rootScope.getSelectedCharityDescription();
    $scope.charityAvatar = $rootScope.getSelectedCharityAvatar();
    $scope.charityUrl = $rootScope.getSelectedCharityUrl();

    console.log('$rootScope.getSelectedCharityName: ' + $rootScope.getSelectedCharityName());

    $scope.moneyRaised = $rootScope.getMoneyRaisedPerMile();

    if($scope.charityName == undefined){
      $scope.noCharity = true;
      console.log('noCharityValue: ' + $scope.noCharity);
    }

    $scope.pastCharities = [];
    $scope.pastCharityMoneyRaised = [];

    $scope.charityHistoryCall = function(){
      HistoryAPI.getAll($rootScope.getUserId())
        .success(function(data, status, headers, config){
          console.log('inside historyAPI get all success call');
          console.log('run data legnth: ' + data.length);
          for(var i=0; i< data.length; i++){
            console.log('data['+i+'].charity: ' + data[i].charity);
            var charityIndex = $scope.pastCharities.indexOf(data[i].charity);
            console.log('charityIndex: ' + charityIndex);
            if(charityIndex == -1){
              $scope.pastCharities.push(data[i].charity);
              $scope.pastCharityMoneyRaised.push(data[i].moneyRaised);
              console.log('$scope.pastCharities['+i+']:' + $scope.pastCharities[i]);
              console.log('$scope.pastCharityMoneyRaised['+i+']: ' + $scope.pastCharityMoneyRaised[i]);
            } else {
              console.log('pastMoneyRaised array before addition: ' + $scope.pastCharityMoneyRaised);
              console.log(data[i].charity + ' is already in pastCharitiesArray');
              console.log('data['+i+'].moneyRaised: ' + data[i].moneyRaised);
              $scope.pastCharityMoneyRaised[charityIndex] = $scope.pastCharityMoneyRaised[charityIndex] + data[i].moneyRaised;
              console.log('$scope.pastCharityMoneyRaised['+charityIndex+'] post addition: ' + $scope.pastCharityMoneyRaised[charityIndex]);
            }
            // $scope.pastCharities.push(data[i].charity);
            // $scope.pastCharitiesMoneyRaised.push(data[i].moneyRaised);
            // if($scope.pastCharities.indexOf(data[i].charity) !== -1){
            //   console.log('pastCharities array already contains: ' + data[i].charity);
            // } else {
            //   $scope.pastCharities.push(data[i].charity);
            // }
          }
          console.log('$scope.pastCharities.length: ' + $scope.pastCharities.length);
          return $scope.pastCharities;
          // for(var i=0; i< $scope.pastCharities.length; i++){
          //   $scope.charity = $scope.pastCharities[i];
          //   console.log('$scope.pastCharities[i]: ' + $scope.pastCharities[i]);
          //   for(var x=0; x<data.length; x++){
          //     if($scope.charity = data[x].charity){
          //       console.log('data[i].charity: ' + data[x].charity + ' data['+x+']' + data[x].moneyRaised);
          //       $scope.thisCharityMoneyRaised =  $scope.thisCharityMoneyRaised + data[x].moneyRaised;
          //       console.log('$scope.thisCharityMoneyRaised: ' + $scope.thisCharityMoneyRaised);
          //       if($scope.thisCharityMoneyRaised == undefined || $scope.charity == undefined ||
          //       $scope.thisCharityMoneyRaised == "NaN" || $scope.charity == "NaN"){
          //         console.log('$scope.thisCharityMoneyRaised or $scope.charity is undefined');
          //       } else {
          //         $scope.charityListInformation.push($scope.charity, $scope.thisCharityMoneyRaised);
          //         console.log('$scope.charityListInformation: ' + $scope.charityListInformation);
          //         console.log('$scope.charityListInformation.length: ' + $scope.charityListInformation.length);
          //         // console.log('$scope.charityListInformation['+x+']: ' + $scope.charityListInformation[x]);
          //         console.log('$scope.charityListInformation['+x+'].charity: ' + $scope.charityListInformation.charity);
          //         console.log('$scope.charityListInformation['+x+'].moneyRaised: ' + $scope.charityListInformation.moneyRaised);
          //       }
          //
          //     }
          //   }
          // }
        })
        .error(function(err){
          console.log('History API call getAll failed');
        });
    }



    //TODO: ADD MONEY RAISED CALL FOR EACH SELECTED CHARITY

    CharityAPI.getAll()
      .success(function(data, status, headers, config){

        console.log("API call getAll succeeded");

        $scope.charities = [];
        var pastCharities = $scope.charityHistoryCall();
        console.log('pastCharities: ' + $scope.pastCharities);
        console.log('pastCharitiesMoneyRaised: ' + $scope.pastCharitiesMoneyRaised);


        for(var i = 0; i < data.length; i++){
          $scope.charities.push(data[i]);
        }



      })
      .error(function(err,status){
        console.log("Error retrieving charities");
        $rootScope.hide();
        $rootScope.notify("Something went wrong retrieving the list of charities");
        $rootScope.verifyStatus(status);
      });


    $scope.getSelectedCharityMoneySplits = function(charityNameString){
      //TODO: ADD DATE FOR MONTH MONEY DETERMINANT
      $scope.selectedCharityTotalMoneyRaised = 0;
      $scope.selectedCharityMonthMoneyRaised  = 0;
      HistoryAPI.getCharityHistory($rootScope.getUserId(), charityNameString)
        .success(function(cData, status, headers, config){
          console.log('charityNameString, History API success: ' + charityNameString);
          for(var i=0; i< cData.length; i++){
            console.log('cData[i].charity:  ' + cData[i].charity);
            if(charityNameString = cData[i].charity){
              console.log('charityNameString and cData['+i+'] matched with: ' + charityNameString + ' ' + cData[i].charity);
              $scope.selectedCharityTotalMoneyRaised = $scope.selectedCharityTotalMoneyRaised + cData[i].moneyRaised;

              console.log('cData['+i+'].month: ' + cData[i].month);
              if(charityMonth = cData[i].month){
                console.log('charityMonth and cData['+i+'] matched with: ' + charityMonth + ' ' + cData[i].month);
                $scope.selectedCharityMonthMoneyRaised = $scope.selectedCharityMonthMoneyRaised +  cData[i].moneyRaised;
              }
            }
          }

          $scope.displaySelectedTotalMoneyRaised = $scope.selectedCharityTotalMoneyRaised;
          console.log('$scope.displaySelectedTotalMoneyRaised: ' + $scope.displaySelectedTotalMoneyRaised);
          $scope.displaySelectedCharityMonthMoneyRaised = $scope.selectedCharityMonthMoneyRaised;
          console.log('$scope.displaySelectedCharityMonthMoneyRaised: ' + $scope.displaySelectedCharityMonthMoneyRaised);
        })
        .error(function(err){
          console.log('getCharityHistory API call failure');
        });

    }




    $scope.selectCharity = function(charityName){

      var email = $rootScope.getEmail();
      console.log('email: ' + email);
      console.log('charity: ' + charityName);
      var charityNameString = charityName.toString();
      console.log('charityNameString:' +charityNameString);
      $rootScope.removeSelectedCharityName();
      $scope.getSelectedCharityMoneySplits(charityNameString);

      var today = new Date();
      console.log('today: ' + today);
      var todaySplitter = today.toString().split(' ');
      var charityMonth =  todaySplitter[1];
      console.log('charityMonth: ' + charityMonth);


      $scope.pastCharity = [];

      //var newCharity = charity.toString();

      console.log($rootScope.getUserId());
      CharityAPI.selectCharity($rootScope.getUserId(), {charityName: charityNameString})
        .success(function(data, status, headers, config){
          console.log('charityNameString from API success: ' + charityNameString);
          $scope.charityName = charityNameString;

          $rootScope.setSelectedCharityName(charityNameString);
          console.log('charity: ' + $rootScope.getSelectedCharity());
          console.log('attempting to update user\'s selected charity');
          console.log('inside select charityAPI success');
          //$window.location.href=('#/app/run');
          console.log('charity API succeeded in selecting charity');

          console.log('charityNameString: ' + charityNameString);
          console.log('user id: ' + $rootScope.getUserId());





        })
        .error(function(err,status){
          console.log(err);
          console.log('inside select charityAPI failure');
          $rootScope.notify('Error selecting charity');
          $rootScope.verifyStatus(status);
        });
    }
  });
