// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic',
  'starter.accountController',
  'starter.addRaceController',
  'starter.authController',
  'starter.appController',
  'starter.charityController',
  'starter.historyController',
  'starter.historyListController',
  'starter.historyDayController',
  'starter.inviteSponsorController',
  'starter.myDonationController',
  'starter.runController',
  'starter.addRaceController',
  'starter.findRacesController',
  'starter.myRacesController',
  'starter.pastRacesController',
  'starter.raceProfileController',
  'starter.raceController',
  'starter.directives',
  'stripe', 'ngOpenFB',
  'angular-storage',
  'chart.js','googleplus',
  'ngCookies',
  'angular-svg-round-progressbar',
  'ion-datetime-picker',
  'ngMaterial'
])

  .run(function($ionicPlatform, ngFB) {

    // TODO facebook application id, need to replace whenr release
    ngFB.init({appId: '1079958642070604'});

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  // TODO google application id, need to replace whenr release
  .config(['GooglePlusProvider', function(GooglePlusProvider) {
         GooglePlusProvider.init({
           clientId: '69391540233-4b06qqevu0hc43puqta6ded42lbo1s0v.apps.googleusercontent.com',
           apiKey: 'AIzaSyBPjBC7a_MQp40VadwHeInENsCKnDqxdsw'
         });
  }])

  .constant('CLIENT_HOST','http://localhost:8100/')
  .constant('SERVER_HOST','https://dreamrun.herokuapp.com/')
  //.constant('SERVER_HOST','http://localhost:5000/')

  .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push(function($q, $cookies) {
          return {
           'request': function(config) {
                config.headers['authorization'] = $cookies.get('token');
                return config;
            }
          };
        });
  }])

  .config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');

  }])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('auth', {
        url:"/auth",
        abstract: true,
        templateUrl: "templates/auth.html"
      })
      .state('auth.signin', {
        url:'/signin',
        views: {
          'auth-signin':{
            templateUrl: 'templates/auth-signin.html',
            controller: 'SigninCtrl'
          }
        }
      })

      .state('auth.signup', {
        url: '/signup',
        views: {
          'auth-signup': {
            templateUrl: 'templates/auth-signup.html',
            controller: 'SignUpCtrl'
          }
        }
      })
      .state('reset', {
          url:'/reset:email',
          templateUrl: 'templates/reset.html',
          controller: 'ResetCtrl'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })


      .state('app.run', {
        url:'/run',
        views: {
          'app-run': {
            templateUrl: 'templates/run.html',
            controller:'RunCtrl'
          }
        }
      })

      .state('app.accountInfo', {
        url: '/accountInfo',
        views: {
          'app-account': {
            templateUrl: 'templates/accountInfo.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('app.charities', {
        url: '/charities',
        views: {
          'app-charities': {
            templateUrl: 'templates/charities.html',
            controller: 'CharitiesCtrl'
          }
        }
      })

      .state('app.createCharity',{
        url:'/createCharity',
        views: {
          'app-charities':{
            templateUrl:'templates/createCharity.html',
            controller: 'createCharityCtrl'
          }
        }
      })

      .state('app.mySponsors',{
        url:'/mySponsors',
        views:{
          'app-sponsors':{
            templateUrl:'templates/mySponsors.html',
            controller: 'MyDonationCtrl'
          }
        }
      })

      .state('app.inviteSponsor-start',{
        url:'/inviteSponsor/start',
        views: {
          'app-sponsors': {
        url:'/inviteSponsor/start/:requestId',
            templateUrl:'templates/inviteSponsor-start.html',
            controller:'InviteSponsorStartCtrl'
          }
        }
      })

      .state('app.inviteSponsor-info',{
        url:'/inviteSponsor/info',
        views: {
          'app-sponsors': {
            templateUrl:'templates/inviteSponsor-info.html',
            controller:'InviteSponsorInfoCtrl'
          }
        }
      })

      .state('app.inviteSponsor-amount',{
        url:'/inviteSponsor/amount',
        views: {
          'app-sponsors': {
            templateUrl:'templates/inviteSponsor-amount.html',
            controller:'InviteSponsorAmountCtrl'
          }
        }
      })

      .state('app.inviteSponsor-pledge', {
        url:'/inviteSponsor/pledge',
        views: {
          'app-sponsors': {
            templateUrl:'templates/inviteSponsor-pledge.html',
            controller:'InviteSponsorPledgeCtrl'
          }
        }
      })

      .state('app.inviteSponsor-payment',{
        url:'/inviteSponsor/payment',
        views: {
          'app-sponsors': {
            templateUrl:'templates/inviteSponsor-payment.html',
            controller:'InviteSponsorPaymentCtrl'
          }
        }
      })

      .state('app.inviteSponsor-end',{
        url:'/inviteSponsor/end',
        views:{
          'app-sponsors': {
            templateUrl:'templates/inviteSponsor-end.html',
            controller:'InviteSponsorEndCtrl'
          }
        }
      })

      .state('app.history', {
        url: '/history',
        views: {
          'app-history': {
            templateUrl: 'templates/history.html',
            controller: 'HistoryCtrl'
          }
        }
      })
      /*-------*/
      .state('app.historyDay', {
        url: '/historyDay',
        views: {
          'app-history':{
            templateUrl: 'templates/history-day.html',
            controller: 'HistoryDayCtrl'
          }
        }
      })
      .state('app.historyList', {
        url: '/historyList',
        views: {
          'app-history': {
            templateUrl: 'templates/historyList.html',
            controller: 'HistoryListCtrl'
          }
        }
      })
      .state('app.myPledges',{
        url:'/myPledges',
        views:{
          'app-sponsors':{
            templateUrl:'templates/myPledges.html',
            controller: 'MyDonationCtrl'
          }
        }
      })

      .state('app.races', {
        url: '/races',
        views: {
          'app-races': {
            templateUrl: 'templates/races.html',
            controller: 'RacesCtrl'
          }
        }
      })

      .state('app.myRaces', {
        url: '/myRaces',
        views: {
          'app-races': {
            templateUrl: 'templates/myRaces.html',
            controller: 'MyRacesCtrl'
          }
        }
      })

      .state('app.findRaces', {
        url: '/findRaces',
        views: {
          'app-races': {
            templateUrl: 'templates/findRaces.html',
            controller: 'FindRacesCtrl'
          }
        }
      })

      .state('app.pastRaces', {
        url: '/pastRaces',
        views: {
          'app-races': {
            templateUrl: 'templates/pastRaces.html',
            controller: 'PastRacesCtrl'
          }
        }
      })

    .state('app.createRace', {
      url: '/createRace',
      views: {
        'app-races': {
          templateUrl: 'templates/addRace.html',
          controller: 'AddRaceCtrl'
        }
      }
    })
      .state('app.raceProfile', {
        url:'/raceProfile',
        views: {
          'app-races': {
            templateUrl:'templates/raceProfile.html',
            controller: 'RaceProfileCtrl'
          }
        }
      })

      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/signin');
    // $urlRouterProvider.otherwise('/app/run');

    Stripe.setPublishableKey('pk_test_U5LiYvbQvafjstjzow9RjSzg');

  });
