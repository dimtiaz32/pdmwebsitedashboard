/**
 * Created by dev on 8/2/16.
 */

angular.module('starter.myDonationController', ['starter.appServices',
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


  .controller('MyDonationCtrl',function($rootScope, $scope, HistoryAPI, AuthAPI,  $window, $ionicModal, $cordovaSms, $cordovaSocialSharing,DonationAPI,AuthAPI, CLIENT_HOST, $ionicPopover) {

    $scope.menuActive = false;
    $scope.menuToggle = function(){
      $scope.menuActive = !$scope.menuActive
    };


    $scope.name = $rootScope.getName();
    $scope.totalMoneyRaised = 0;

    HistoryAPI.getAll($rootScope.getUserId())
      .success(function(data, status, headers, config){
        for(var i = 0; i< data.length; i++) {
          console.log('data.['+i+'].moneyRaised: ' + data[i].moneyRaised);

          $scope.totalMoneyRaised = data[i].moneyRaised + $scope.totalMoneyRaised;
        }
      })
      .error(function(err){
        console.log('inside charity get all API call failure');
      })
      .finally(function(){
        console.log("Refresh Finally");
        $scope.$broadcast('scroll.refreshComplete');
      });

    //Popover Menu - Sponsors/Pledges

    $scope.isLinkSelected = false;
    $scope.selectLink = function() {
      console.log('held down/double tap');
      $scope.isLinkSelected = true;
    };

    $scope.popoverTemplate =
      '<ion-popover-view class="sponsors-pledges-page popover"><ion-content>' +
      '<div class="list">' +
      '<a class="item" ng-click="popupNavSponsors()">My Sponsors</a>' +
      '<a class="item" ng-click="popupNavPledges()">My Pledges</a>' +
      '</div>' +
      '</ion-content>' +
      '</ion-popover-view>';;

    $scope.popover = $ionicPopover.fromTemplate($scope.popoverTemplate, {
      scope: $scope
    });
    $scope.openPopover = function($event) {
      $scope.popover.show($event);
      $scope.menuActive = true;
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
      $scope.menuActive = false;
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
      $scope.menuActive = false;
    });
    $scope.popupNavSponsors = function() {
      $window.location.href = ('#/app/mySponsors');
      $scope.closePopover();
    };
    $scope.popupNavPledges = function() {
      $window.location.href = ('#/app/myPledges');
      $scope.closePopover();
    };




    $rootScope.$on('initial', function () {
      console.log("---------start donation ctrl initial---------");
      $scope.username = $rootScope.getName();
      $scope.avatar = $rootScope.getAvatar();
      console.log("---------end donation ctrl initial---------");
    });

    $rootScope.$on('destroy', function () {
      console.log("---------start donation ctrl destroy---------");
      $scope.username = undefined;
      $scope.avatar = undefined;
      console.log("---------end donation ctrl destroy---------");
    });

    $rootScope.$broadcast('initial');

    $scope.managePledges = function () {
      $rootScope.$broadcast('fetchMyPledges');
      $window.location.href = "#/app/myPledges";
    };

    $scope.manageSponsors = function () {
      $rootScope.$broadcast('fetchMySponsors');
      $window.location.href = "#/app/mySponsors";
    };

    $scope.doRefresh = function (fetchType) {
      console.log("fetchType:" + fetchType);
      $rootScope.$broadcast(fetchType);
    };

    $scope.formateDate = function (date) {
      return $filter('date')(date, "MMM dd yyyy");
    };

    $scope.formateCurreny = function (amount) {
      var realAmount = parseInt(amount);

      if (realAmount < 100) {
        return amount + " ¢";
      } else {
        return realAmount / 100 + " $";
      }

    };

    $ionicModal.fromTemplateUrl('templates/inviteSponsor.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function ($event) {
      console.log("try open the modal");
      DonationAPI.inviteSponsor({
        // charity:"5771430bdcba0f275f2a0a5e",
        // userId:"577525799f1f51030075a291"
        //might have to cast these to strings?
        charity: $rootScope.getSelectedCharityId(),
        userId: $rootScope.getUserId()
      }).success(function (data, status, headers, config) {
        // $scope.inviteUrl = CLIENT_HOST + "#/app/inviteSponsor/start?id=" + data.code;
        $scope.inviteUrl = "https://www.projectdreammiles.com/#/invite/start?id=" + data.code;
        console.log("local data:" + $scope.inviteUrl);
        // $scope.shareBySMS = function() {
        //   console.log("sms share begin")
        //   $cordovaSocialSharing.shareViaSMS("aaaaa", "0612345678,0687654321").then(function(result) {
        //       console.log("sms share success");
        //     }, function(err) {
        //       console.log("sms share failure");
        //   });
        // }
        $scope.shareByMail = function () {
          console.log("email share begin");
          $cordovaSocialSharing.shareViaEmail("aaa", "bbb", "", "", "", "").then(function (result) {
            console.log("email share success");
          }, function (err) {
            console.log("email share failure");
          });
        };

        $scope.shareBySMS = function () {
          console.log("begin share by sms");
          $cordovaSms.send("", "Pledge link: " + data)
            .then(function () {
              console.log('share sms success');
            }, function (error) {
              console.log('share sms failure');
              console.log(error);
            });
        };

        $scope.shareByFB = function () {
          console.log("begin share by facebook");
          $cordovaSocialSharing.shareViaFacebook(data, null, data).then(function (result) {
            console.log('share facebook success');
          }, function (err) {
            console.log('share facebook failure');
            console.log(err);
          });
        }


      }).error(function (err, status) {
        console.log("Refresh Error~");
        $rootScope.notify("Oops something went wrong!! Please try again later");
        $rootScope.verifyStatus(status);
      });
      $scope.modal.show($event);
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.$on('modal.hidden', function () {
      console.log("execute modal.hidden");
    });

    $scope.$on('modal.removed', function () {
      console.log("execute modal.removed");
    });
  });
