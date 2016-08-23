/**
 * Created by dev on 8/3/16.
 */


angular.module('starter.raceProfileController', ['starter.appServices',
  'starter.charityServices',
  'starter.authServices',
  'starter.runServices',
  'starter.donationServices',
  'starter.userServices',
  'starter.historyServices',
  'starter.raceServices',
  'starter.runServices',
  'ionic',
  'chart.js',
  'ngCordova','ngOpenFB','ngCookies',
  'ionic.contrib.drawer.vertical',
  'angular-svg-round-progressbar'])



  .controller('RaceProfileCtrl', function($scope, $rootScope,$window, RaceAPI, AuthAPI, RaceAPI, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate, $timeout, $ionicViewSwitcher, $ionicHistory) {

    $scope.goBack = function() {
      //ionicViewSwitcher.nextDirection specifies the animation direction when switching page
      $ionicViewSwitcher.nextDirection('back');
      //ionicHistory is a record of the app's navigation history
      $ionicHistory.goBack();
    };
    $scope.isSignedUp;

    $scope.raceId = $rootScope.getRaceId();
    console.log('raceId:  ' + $scope.raceId);


    $scope.race = [];
    $scope.charityPartners = [];
    $scope.raceDistances = [];
    $scope.userRaces = [];

    $scope.checkIds = function(){
      console.log('check ids entered with user raceIds: ' + JSON.stringify());
      console.log('check ids raceId: ' + $scope.raceId);
      for(var i=0; i<$scope.userRaces.length; i++){
        if($scope.raceId == $scope.userRaces[i]){
          console.log('race ids matched with: ' + $scope.raceId + '  $scope.userRaces['+i+']' + $scope.userRaces[i])
          return true;
        } else {
          console.log('race ids matched with: ' + $scope.raceId + '  $scope.userRaces['+i+']' + $scope.userRaces[i])

        }
      }
      return false;
    }



    RaceAPI.getRaceById($scope.raceId)
      .success(function(data, status, headers, config){
        $scope.raceName = data.name;
        $scope.raceDate = data.date;
        // $scope.raceDistances = data.distances;
        var tempDistanceHolder = data.distances;
        var tempCharityPartners = data.charityPartners;
        $scope.raceDescription = data.description;

        var partnersSplit = tempCharityPartners.toString().split(',');
        console.log('partnersSplit: ' + partnersSplit);
        if(partnersSplit.length >0){
          for(var i = 0; i< partnersSplit.length; i++){
            $scope.charityPartners.push(partnersSplit[i]);
          }
          console.log('charityPartners: ' + JSON.stringify($scope.charityPartners));
        }

        var distanceSplit = tempDistanceHolder.toString().split(',');
        console.log('distanceSplit: ' + distanceSplit);
        if(distanceSplit.length> 0){
          for(var i=0; i< distanceSplit.length; i++){
            var fDistance = distanceSplit[i];
            $scope.raceDistances.push(fDistance);

          }
        } else {
          console.log('distanceSplit has length less than 1: ' + distanceSplit.length);
        }
        console.log('raceDistances: ' + JSON.stringify($scope.raceDistances));


      })
      .error(function(status){
        console.log('RaceAPI getRaceById call failed with status: ' + status);
      });

    RaceAPI.getUserRaces($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('RaceAPI getUserRaces succeeded');
        console.log('getUser races data.length: ' + data.length);
        for(var i=0; i< data.length; i++){
          console.log('data['+i+']:._id: ' + data[i]._id);
          $scope.userRaces.push(data[i]._id);
        }
        console.log('user race ids: ' + JSON.stringify($scope.userRaces));
        $scope.isSignedUp = $scope.checkIds();
      })
      .error(function(err, status){
        console.log('RaceAPI getUserRaces failed with status: ' + status + 'and err: ' + err);
      });

    $scope.registerForRace = function(){
      $rootScope.show("Registering race");
      console.log('$rootScope.getRaceId: ' + $scope.userId);
      console.log('$scope.raceId:  ' + $scope.raceId);
      var userId = $rootScope.getUserId();
      console.log('userID: ' + userId);
      console.log('raceId: ' + $scope.raceId);
      RaceAPI.joinRace({userId: userId}, $scope.raceId)
        .success(function(data, status, headers, config){
          console.log('RaceAPI join race call success');
          console.log('data: ' + data);
          $scope.isSignedUp = true;
          $rootScope.hide();
        })
        .error(function(status){
          console.log('RaceAPI join race call failed with status: ' + status);
          $rootScope.notify("Oops! Unable to register for race!");
        });
    }

    $scope.setFalse = function(){
      $scope.isSignedUp = $scope.isSignedUp;
    }


    $scope.removeRace = function(){
      console.log('removing race: ' + $scope.raceId);
      RaceAPI.removeRace($scope.raceId, $rootScope.getUserId())
        .success(function(data, status, headers, config){

          $scope.setFalse();
          console.log('isSignedUp: ' + $scope.isSignedUp);
          $ionicPopup.alert({
            title:'Race removed!'
          });


        })
        .error(function(err, status){
          console.log('RaceAPI failed with status:  ' + status +' and error: ' + err);
        });

    }

  });
