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



  .controller('RacesCtrl', function($scope, $rootScope, $window, AuthAPI, RaceAPI,  $ionicSlideBoxDelegate, $timeout) {

    //Slider stuffs
    $scope.slideOptions = {
      loop: true,
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
      $window.location.href = ('#/app/raceProfile');
    }
  });
