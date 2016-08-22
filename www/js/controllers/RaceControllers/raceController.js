/**
 * Created by dev on 8/2/16.
 */
angular.module('starter.raceController', ['starter.appServices',
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



  .controller('RacesCtrl', function($scope, $rootScope, $window, AuthAPI, RaceAPI,  $ionicSlideBoxDelegate, $timeout, $ionicViewSwitcher) {

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


    console.log('raceAPI get featured races called');
    var feat = true;
    console.log('feat: ' + feat);
    $scope.featuredRaces = [];


    $rootScope.show('Loading races...');

    RaceAPI.getFeaturedRaces(feat)
    .success(function(data, status, headers, config){
      console.log('RaceAPI get featured races call succeeded');
      console.log('data.length: ' + data.length);
      for(var i=0; i<data.length; i++){
        $scope.featuredRaces.push(data[i]);
      }
      $rootScope.hide();
    })
    .error(function(status){
      console.log('raceAPI get featured races call failed with status: ' + status);
    });

    $scope.selectRace = function(id){
      console.log('select race called with id: ' + id);
      $rootScope.setRaceId(id);
      $ionicViewSwitcher.nextDirection('forward');
      $window.location.href = ('#/app/raceProfile');
    };

    $scope.displayDistanceForRace = function(race) {
      distanceArray = race.distances.split(",");
      distanceString = "";
      for (var i = 0; i < distanceArray.length; i++) {
        distanceString += distanceArray[i];
        if (i < (distanceArray.length - 1)) {
          distanceString += ", ";
        }
      }
      return distanceString;
    };

    $rootScope.$on('fetchMyRaces', function(){
      RaceAPI.getUserRaces($rootScope.getUserId())
        .success(function(data, status, headers, config){
          console.log('Race API getUsersRaces call succeeded ');
          console.log('getUsersRaces data.length: ' + data.length);
          var counter = 0;
          if(data.length >0){
            for(var i = 0; i< data.length; i++){
              counter++;
              console.log('counter: ' + counter);
            }
            $scope.myRacesSubHeader = 'You have ' + counter +' upcoming races.'
          }
          else {
            console.log('getUsersRaces data.length was less than 1');
            $scope.myRacesSubHeader = 'You have not signed up for a race yet!';
          }
        })
        .error(function(err, status){
          console.log('Race API getUsersRaces call failed with status: ' + status +' and error: ' + err);
        }).finally(function(){
          $rootScope.$broadcast('scroll.refreshComplete');
      });
    });

    $rootScope.$broadcast('fetchMyRaces');



    RaceAPI.getPastRaces($rootScope.getUserId())
      .success(function(data, status, headers, config){
        console.log('RaceAPI getPastRaces succeeded');
        console.log('getPastRaces data.length: ' + data.length);
        var counter = 0;
        if(data.length > 0){
          for(var i=0; i<data.length; i++){
            counter++;
          }
          $scope.pastRacesSubheader = 'You have completed ' + counter + ' races';
        } else {
          console.log('data.length was less than one');
          $scope.pastRacesSubheader = 'You have completed 0 races';
        }
      })
      .error(function(err, status){
        console.log('RaceAPI getPastRaces failed with status: ' + status + '   and error: ' + err);
      })

  });
