// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'stripe'])

  .run(function($ionicPlatform) {
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
            controller: 'LoginCtrl',
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


      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })


      .state('app.run', {
        url:'/run',
        views: {
          'menuContent': {
            templateUrl: 'templates/run.html',
            controller:'RunCtrl'
          }
        }
      })

      .state('app.accountInfo', {
        url: '/accountInfo',
        views: {
          'menuContent': {
            templateUrl: 'templates/accountInfo.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('app.charities', {
        url: '/charities',
        views: {
          'menuContent': {
            templateUrl: 'templates/charities.html',
            controller: 'CharitiesCtrl'
          }
        }
      })

      .state('app.createCharity',{
        url:'/createCharity',
        views: {
          'menuContent':{
            templateUrl:'templates/createCharity.html',
            controller: 'createCharityCtrl'
          }
        }
      })

      .state('app.mySponsors',{
        url:'/mySponsors',
        views:{
          'menuContent':{
            templateUrl:'templates/mySponsors.html',
            controller: 'MyDonationCtrl'
          }
        }
      })

      .state('app.inviteSponsor-start',{
        url:'/inviteSponsor/start',
        views: {
          'menuContent': {
            templateUrl:'templates/inviteSponsor-start.html',
            controller:'InviteSponsorStartCtrl'
          }
        }
      })

      .state('app.inviteSponsor-info',{
        url:'/inviteSponsor/info',
        views: {
          'menuContent': {
            templateUrl:'templates/inviteSponsor-info.html',
            controller:'InviteSponsorInfoCtrl'
          }
        }
      })

      .state('app.inviteSponsor-amount',{
        url:'/inviteSponsor/amount',
        views: {
          'menuContent': {
            templateUrl:'templates/inviteSponsor-amount.html',
            controller:'InviteSponsorAmountCtrl'
          }
        }
      })

      .state('app.inviteSponsor-pledge', {
        url:'/inviteSponsor/pledge',
        view: {
          'menuContent': {
            templateUrl:'templates/inviteSponsor-pledge.html',
            controller:'InviteSponsorPledgeCtrl'
          }
        }
      })

      .state('app.inviteSponsor-payment',{
        url:'/inviteSponsor/payment',
        view: {
          'menuContent': {
            templateUrl:'templates/inviteSponsor-payment.html',
            controller:'InviteSponsorPaymentCtrl'
          }
        }
      })

      .state('app.inviteSponsor-end',{
        url:'/inviteSponsor/end',
        view:{
          'menuContent': {
            templateUrl:'templates/inviteSponsor-end.html',
            controller:'InviteSponsorEndCtrl'
          }
        }
      })

      .state('app.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/history.html',
            controller: 'HistoryCtrl'
          }
        }
      })

      .state('app.myPledges',{
        url:'/myPledges',
        views:{
          'menuContent':{
            templateUrl:'templates/myPledges.html',
            controller: 'MyDonationCtrl'
          }
        }
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/signin');

    Stripe.setPublishableKey('pk_test_AcHwMgfwhswjYGUhawRw0her');
  });
