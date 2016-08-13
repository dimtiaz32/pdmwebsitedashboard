/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.historyDayController', [
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

  .controller('HistoryDayCtrl', function($scope, $rootScope, $window, HistoryAPI, AuthAPI, $ionicSlideBoxDelegate, AuthAPI, $filter, roundProgressService, $timeout, $ionicPopup, $ionicNavBarDelegate, $ionicViewSwitcher){
    console.log('history day controller entered with run id: ' + $rootScope.dayRunId);

        $scope.goBack = function() {
          $ionicViewSwitcher.nextDirection('back');
          $window.location.href = ('#/app/historyList')
        };
    $scope.mapCreated = function(map) {
      $scope.map = map;
      console.log('mapCreated entered/should work');
      $scope.mapOptions = map.setOptions({
        center: $scope.middle,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    }

  $scope.pathArray = [];
  $scope.lapsArray = [];
  HistoryAPI.getById($rootScope.getUserId(), $rootScope.dayRunId)
    .success(function(data, status, headers, config){
      console.log('data length: ' + data.length);

      if(data.length == 1){
        console.log('data[0].seconds' + data[0].seconds +'  data[0].minutes' + data[0].minutes);
        if (data[0].seconds < 10) {
          $scope.duration = data[0].minutes.toString() + ":0" + data[0].seconds.toString();
        } else {
          $scope.duration = data[0].minutes.toString() + ":"  + data[0].seconds.toString();
        }
        console.log('$scope.duration: ' + $scope.duration);

        $scope.distance = data[0].distance;
        $scope.pace = data[0].pace;
        $scope.funds = data[0].moneyRaised;

        $scope.lapsArray.push(data[0].laps);
        $scope.pathArray.push(data[0].path);
        console.log('lapsArray: ' + $scope.lapsArray[0].number);

        $scope.historyPolyCoords = [];
        $scope.lapsForm = [{
          number: String,
          distance: String,
          time: String,
          pace: String
        }];


       //  console.log('$dayDisplayPath.lat.length: ' + $scope.dayDisplayPath.lat.length);
       //
       // console.log('setValuesForHistoryDayView: $scope.dayDisplayPath.lat.length: ' + $scope.dayDisplayPath[x].lat.length);
       var latSplit = $scope.pathArray[0].lat.toString().split(',');
       var longSplit = $scope.pathArray[0].long.toString().split(',');

       console.log('setValuesForHistoryDayView: latSplit.length: ' + latSplit.length);
       console.log('setValuesForHistoryDayView: longSplit: ' + longSplit);


       console.log('$scope.lapsArray.length: ' + $scope.lapsArray.length);

       //string splitter for laps
       var lapNumberSplit = $scope.lapsArray[0].number.toString().split(',');
       var lapDistancesSplit = $scope.lapsArray[0].distance.toString().split(',');
       var lapSecondsSplit = $scope.lapsArray[0].seconds.toString().split(',');
       var lapMinutesSplit = $scope.lapsArray[0].minutes.toString().split(',');
       var lapPaceSplit = $scope.lapsArray[0].pace.toString().split(',');
       // lapNumberSplit.shift();
       // lapDistancesSplit.shift();
       // lapSecondsSplit.shift();
       // lapMinutesSplit.shift();
       // lapPaceSplit.shift();



        for (var i = 0; i < lapNumberSplit.length; i++) {
          console.log('setValuesForHistoryDayView: lapNumberSplit['+i+']: ' + lapNumberSplit[i]);
          console.log('setValuesForHistoryDayView: lapDistancesSplit['+i+']: ' + lapDistancesSplit[i]);
          console.log('setValuesForHistoryDayView: lapSecondsSplit['+i+']: ' + lapSecondsSplit[i]);
          console.log('setValuesForHistoryDayView: lapMinutesSplit['+i+']: ' + lapMinutesSplit[i]);
          console.log('setValuesForHistoryDayView: lapPaceSplit['+i+']: ' + lapPaceSplit[i]);

          var time = lapMinutesSplit[i] + ':' + lapSecondsSplit[i];
          console.log('time: '+ time);

          $scope.lapsForm.push( {number: lapNumberSplit[i], distance: lapDistancesSplit[i],
            time: time,  pace: lapPaceSplit[i]});
          console.log('setValuesForHistoryDayView: $scope.dayLaps: ' + $scope.lapsForm);
          console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.lapsForm);

        }

        console.log('setValuesForHistoryDayView: $scope.dayLaps.length: ' + $scope.lapsForm.length);
        //
        // $scope.distancePopHolder  = [];
        // $scope.durationPopHolder = [];
        // $scope.pacePopHolder = [];
        // $scope.moneyRaisedPopHolder = [];
        // $scope.pathPopHolder = [];
        // $scope.lapsPopHolder = [];

        console.log('latSplit.length: ' + latSplit.length);
        if(latSplit.length == longSplit.length){
          for(var i=0; i< latSplit.length; i++){
            var latCoord = latSplit[i];
            console.log('setValuesForHistoryDayView: latCoord : ' + latCoord);
            var longCoord = longSplit[i];
            console.log('setValuesForHistoryDayView: longCoord : ' + longCoord);
            var LatLng = new google.maps.LatLng(latCoord, longCoord);
            console.log('setValuesForHistoryDayView: LatLng : ' + LatLng);
            $scope.historyPolyCoords.push(LatLng);
            console.log('setValuesForHistoryDayView: $scope.historyPolycoords: ' + $scope.historyPolyCoords);

          }

          console.log('historyPolyCoords length: ' + $scope.historyPolyCoords.length);
          var mc = $scope.historyPolyCoords.length/2;
          if(mc%2===0){
            console.log('mc is whole number: ' + mc);
            $scope.middle = new google.maps.LatLng($scope.historyPolyCoords[mc].lat, $scope.historyPolyCoords[mc].long);
            console.log('middle coord: ' + $scope.middle);
          } else {
            console.log('mc is now whole number: ' + mc);
            mc = mc - 0.5;
            console.log('mc -0.5 = ' + mc);
            var hcSplit = $scope.historyPolyCoords[mc].toString().split(',');
            console.log('hcSplit: ' + hcSplit);
            var latSplit = hcSplit[0];
            var longSplit = hcSplit[1];
            console.log('latSplit: ' + latSplit +'   longSplit: ' + longSplit);
            latSplit = latSplit.split('(');
            longSplit = longSplit.split(')');
            console.log('latSplit: ' + latSplit +'   longSplit: ' + longSplit);
            var lat = latSplit[1];
            var long = longSplit[0];
            console.log('lat: ' + lat + '   long: ' + long);

            $scope.middle = new google.maps.LatLng(lat, long);
            console.log('$scope.historyPolyCoords[mc]' + $scope.historyPolyCoords[mc]);
            console.log('middle coord: ' + $scope.middle);
            $scope.mapCreated($scope.map);
          }





          $scope.historyRunPath = new google.maps.Polyline({
            path: $scope.historyPolyCoords,
            strokeColor: '#ff0000',
            strokeOpacity: 1.0,
            strokeWeight: 8
          });
          $scope.historyRunPath.setMap($scope.map);

        } else {
          $rootScope.notify("Lat,Lng lengths do not match");
          console.log('setValuesForHistoryDayView: lat,long lengths do not match');
        }




        for(var i = 0; i< data[0].laps.length; i++){
          $scope.lapArray.push(data[0].laps[i]);
          console.log('laps.distance: ' + $scope.lapArray[i].distance);
        }



      } else {
        console.log('data returned more than one run with id: ' + $rootScope.dayRunId);
      }

    })
    .error(function(err){
      console.log('history API get by id failed with error: ' + err);
    });






  });
