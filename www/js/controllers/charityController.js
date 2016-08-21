/**
 * Created by dev on 8/2/16.
 */

angular.module('starter.charityController', ['starter.appServices',
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


.controller('CharitiesCtrl', function($rootScope, $timeout, $ionicModal, $window, $scope, CharityAPI, HistoryAPI, AuthAPI, UserAPI){
  $rootScope.$on('fetchCharities', function(){
    $rootScope.show("Loading charities");


  $scope.isCharityDetailDisplayed = false;
  $scope.swipeGestureCharityDetail = function(swipe) {
    if (swipe == 'swipe-up') {
      $scope.isCharityDetailDisplayed = false;
    } else if (swipe == 'swipe-down') {
      $scope.isCharityDetailDisplayed = true;
    }
  }

  $scope.toggleCharityDetail = function() {
    $scope.isCharityDetailDisplayed = !$scope.isCharityDetailDisplayed;
  }

  $scope.charity = {
    name: "",
    description: "",
    url: "",
    avatar:""
  };

  $scope.createCharity = function(){
    var name = this.charity.name;
    var description = this.charity.description;
    var url = this.charity.url;
    var avatar = this.charity.avatar;

    $rootScope.show("Please wait... Creating Charity");

    var form  = {
      name: name,
      description: description,
      url: url,
      //user: $rootScope.getToken(),
      avatar: avatar,
      created: Date.now(),
      updated: Date.now()
    }

    CharityAPI.saveCharity(form)
      .success(function(data, status, headers, config){
        $rootScope.hide();
        //$rootScope.doRefresh(1);
        $window.location.href = ('#/app/charities');
      })
      .error(function(err, status){
        $rootScope.hide();
        $rootScope.notify("Error" + err);
        $rootScope.verifyStatus(status);
      });
  };

  // $scope.charityName  = $rootScope.getgetSelectedCharityDisplay()();
  // $scope.charityDescription = $rootScope.getSelectedCharityDescription();
  // $scope.charityAvatar = $rootScope.getSelectedCharityAvatar();
  // $scope.charityUrl = $rootScope.getSelectedCharityUrl();

  // console.log('$rootScope.getSelectedCharityName: ' + $rootScope.getSelectedCharityName());



  // if($scope.charityName == undefined){
  //   $scope.noCharity = true;
  //   console.log('noCharityValue: ' + $scope.noCharity);
  // }





  //new stuff
    //DESIGN IS RIGHT, TRY SCOPING IT

  var userId = $rootScope.getUserId();
  console.log('userId: ' + userId);
  $scope.everyMileRaised = $rootScope.getMoneyRaisedPerMile();


  $scope.pastCharities = [];

  $scope.charitiesList = [];
  $scope.pastCharitiesPop = [];
  $scope.charitiesListPop = [];
  // $scope.charitiesDisplayList = [{
  //   name: String,
  //   description: String,
  //   moneyRaised: Number,
  //   id: Number
  // }];
  $scope.charitiesDisplayList = [];
  $scope.selectedCharityDisplay = {
    name: String,
    totalMoneyRaised: Number,
    monthMoneyRaised: Number,
    description: String,
    url: String,
    avatar: String
  };

  $scope.pastIds = [];
  $scope.charIds = [];
  $scope.objectIds = [];

  console.log('charityName: ' +$rootScope.getSelectedCharityName());


  $scope.selectedCharityDisplay.name = $rootScope.getSelectedCharityName();
  $scope.selectedCharityDisplay.url = $rootScope.getSelectedCharityUrl();
  $scope.selectedCharityDisplay.totalMoneyRaised = $rootScope.getSelectedCharityMoneyRaised();

  Array.prototype.remove = function(value) {
    if (this.indexOf(value)!==-1) {
      this.splice(this.indexOf(value), 1);
      return true;
    } else {
      return false;
    };
  };

  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  }

  var today = new Date();
  console.log('today: ' + today);
  var todaySplitter = today.toString().split(' ');
  $scope.charityMonth = todaySplitter[1];
  console.log('charityMonth: ' + $scope.charityMonth);



  $scope.getSelected = function(id){
    console.log('get Selected entered with id: ' + id);
    var sId = $rootScope.getSelectedCharityId();
    if(id == sId){
      console.log('getSelected ids matched with id: ' + id +'  and sid: ' + sId);
      return true;
    }else {
      console.log('getSelected ids did not match- id: ' + id + ' and sid: ' + sId);
      return false;
    }
  }

  $scope.setSelected = function(oldId, newId){
    console.log('setSelected entered with oldId: ' + oldId + ' and newId: ' + newId);
    for(var i=0; i<$scope.charitiesDisplayList.length; i++){
      if($scope.charitiesDisplayList[i].id == oldId){
        $scope.charitiesDisplayList[i].isSelected = false;
      }
      if($scope.charitiesDisplayList[i].id == newId){
        $scope.charitiesDisplayList[i].isSelected = true;
      }
    }
  }

  $scope.getMonthMoneyRaised = function(cId){
    console.log('charityMonth from getMonthMoney: ' + $scope.charityMonth);
    HistoryAPI.getByMonthAndCharity(userId, cId, $scope.charityMonth)
      .success(function (data, status, headers, config) {
        console.log('HistoryAPI getMonthAndCharity call succeeded');
        console.log('data.length: ' + data.length);
        console.log('data: ' + JSON.stringify(data));
        var more = 0;
        if(data.length != 0) {
          if (data.length > 1) {
            for (var i = 0; i < data.length; i++) {
              more = more+ data[i].moneyRaised;
              console.log('monthMoneyRaised: ' + more);
            }
          } else {
            $scope.selectedCharityDisplay.monthMoneyRaised = data[0].moneyRaised;
            console.log('selectedCharityDisplay.monthMoneyRaised: ' + $scope.selectedCharityDisplay.monthMoneyRaised);
          }
        } else {
          $scope.selectedCharityDisplay.monthMoneyRaised = 0;
        }
        $scope.selectedCharityDisplay.monthMoneyRaised =more;
        console.log('more outside loop: ' + more);
        console.log('$scope.selectedCharityDisplay.monthMoneyRaised: ' + $scope.selectedCharityDisplay.monthMoneyRaised);
      })
      .error(function (err, status) {
        console.log('HistoryAPI getMonthAndCharity call failed with: ' + err + ' and status: ' + status);
      });
  };

  $rootScope.$on('fetchCharityMonthMr', function(){
    console.log('fetchCharityMonth called from broadcast');
    $scope.getMonthMoneyRaised($rootScope.getSelectedCharityId());
  });

  $rootScope.$broadcast('fetchCharityMonthMr');



  CharityAPI.getAll()
    .success(function(data, status, headers, config){
      console.log("API call getAll succeeded");
      console.log('getAll data.length: ' + data.length);

      for(var i = 0; i < data.length; i++) {
        $scope.charitiesList.push(data[i]);
        $scope.charitiesListPop.push(data[i]);
        $scope.charIds.push(data[i]._id);

        console.log(data[i].name);
        console.log('$scope.charitiesList['+i+'].name: ' + $scope.charitiesList[i].name);
      }

      UserAPI.getPastCharities($rootScope.getUserId())
        .success(function(data, status, headers, config){
          console.log('User API getPastCharities call succeeded');
          console.log('getPastCharities data.length: ' + data.length);
          if(data.length > 0){
            $scope.pastCharitiesExist = true;
            for(var i =0; i< data.length; i++){
              $scope.pastCharities.push(data[i]);
              $scope.pastCharitiesPop.push(data[i]);
              $scope.pastIds.push(data[i].id);
              $scope.objectIds.push(data[i]._id);
            }
            console.log('$scope.pastCharities.length: ' + $scope.pastCharities.length);
            console.log('charitiesExist: ' + $scope.pastCharitiesExist);
          } else {
            $scope.pastCharitiesExist = false;
            console.log('charitiesExist: ' + $scope.pastCharitiesExist);
          }

          console.log('pastIds: ' + JSON.stringify($scope.pastIds));
          console.log('charIds: ' + JSON.stringify($scope.charIds));

          console.log('$scope.pastCharities.length: ' + $scope.pastCharities.length);
          console.log('$scope.pastCharities.length: ' + $scope.charitiesList.length);



          $scope.checkPastIds = function(id){
            console.log('moneyRaised check past ids eetered with id: ' + id);
            console.log('moneyRaised pastIds.length: ' + $scope.pastIds.length);
            for(var i=0; i< $scope.pastCharities.length; i++){
              console.log('$scope.charityId['+i+'].id: ' + $scope.pastCharities[i].id);
              if($scope.pastCharities[i].id == id) {
                console.log('moneyRaised ids matched' + $scope.pastIds[i] + '       ' + id);
                var thisMR = $scope.pastCharities[i].moneyRaised;
                console.log('moneyRaised thisMR: ' + thisMR);
                return thisMR;
              }
               else {
                console.log('moneyRaised ids did not match'+ $scope.pastIds[i] + '       '+ id);
              }

            }

          }

          for(var i =0; i< $scope.charitiesList.length; i++){
            var id = $scope.charitiesList[i]._id;
            console.log('moneyRaised id: ' + id);
            money = $scope.checkPastIds(id);
            console.log('moneyRaised money: ' + money);
            if(money == undefined){
              money = 0;
            }
            console.log('money: ' + money);
            var lol = {
              id: id,
              name: $scope.charitiesList[i].name,
              description: $scope.charitiesList[i].description,
              url: $scope.charitiesList[i].url,
              moneyRaised: money,
              avatar: $scope.charitiesList[i].avatar,
              isSelected: $scope.getSelected($scope.charitiesList[i]._id),
              position: i
            };
            $scope.charitiesDisplayList.push(lol);
            console.log('CharitiesDisplayList: ' + JSON.stringify($scope.charitiesDisplayList));
            $rootScope.hide();
          }


          console.log('charitiesDisplayList.lol: ' + JSON.stringify($scope.charitiesDisplayList));
          console.log('charitiesDisplayList.name: ' + $scope.charitiesDisplayList[0].name);
          // $rootScope.$broadcast('listToDisplay');

        })
        .error(function(status, err){
          console.log('User API getPastCharities call failed with status: ' + status + ' and error: ' +err);

        });




    })
    .error(function(err,status){
      console.log("Error retrieving charities");
      $rootScope.hide();
      $rootScope.notify("Something went wrong retrieving the list of charities");
      $rootScope.verifyStatus(status);
    });


  CharityAPI.getById($rootScope.getSelectedCharityId())
    .success(function (data, status, headers, config) {
      console.log('CharityAPI get by id succeeded');
      console.log('data.charity.name: ' + data.name);
      console.log('data.charity.description: ' + data.description);
      // $rootScope.setSelectedCharityName(data.name);
      // $rootScope.setSelectedCharityDescription(data.description);
      // $rootScope.setSelectedCharityUrl(data.url);
      // $rootScope.setSelectedCharityId(data._id);
      // $rootScope.setSelectedCharityMoneyRaised(moneyRaised);
      $scope.selectedCharityDisplay.name = data.name;
      $scope.selectedCharityDisplay.description = data.description;
      $scope.selectedCharityDisplay.url = data.url;
      $scope.selectedCharityDisplay.avatar = data.avatar;

      // $scope.selectedCharityDisplay.totalMoneyRaised = moneyRaised;

      $scope.getMonthMoneyRaised($rootScope.getSelectedCharityId());
      // console.log('charityId from inside setSelectedCharity success call: ' + charityId);
      // $scope.getMonthMoneyRaised(charityId);

    })
    .error(function (err, status) {
      console.log('CharityAPI get by id failed with error: ' + err + ' and status: ' + status);
    })


  $scope.selectCharity = function(charityId, moneyRaised) {

    console.log('charityId: ' + charityId);
    console.log('moneyRaised: ' + moneyRaised);

    console.log('$rootScope.getSelectedCharityMoneyRaised(): ' + $rootScope.getSelectedCharityMoneyRaised());
    console.log('$window.localStorage.totalCharityMoneyRaised: ' + $window.localStorage.totalCharityMoneyRaised);


    var mr = $rootScope.getSelectedCharityMoneyRaised();
    $scope.moneyRaisedCheck = function(mr){
      if(mr == undefined){
        console.log('mr is undefined, returning 0');
       return 0;
      } else{
        console.log('not undefined, returning value: ' + mr);
       return mr;
      }
    };

    console.log('$scope.moneyRaisedCheck: ' + $scope.moneyRaisedCheck(mr));

    $scope.oldSelectedCharityId = $rootScope.getSelectedCharityId();
    console.log('oldSelectedCharityId: ' + $scope.oldSelectedCharityId);


      console.log('updatePastCharities entered with objId: ' + $scope.objId);
      UserAPI.updatePastCharities({
        userId: $rootScope.getUserId(),
        charityId: $rootScope.getSelectedCharityId(),
        moneyRaised: $scope.moneyRaisedCheck($rootScope.getSelectedCharityMoneyRaised())
      })
        .success(function (data, status, headers, config) {
          console.log('UserAPI update past charities call succeeded');
          $scope.updateMoneyRaised();
        })
        .error(function (err, status) {
          console.log('UserAPI update past charities call failed with status: ' + status + ' and error: ' + err);
        });





    console.log('pastCharitieslength' + $scope.pastCharities.length);
    $scope.updateMoneyRaised = function(){
      for (var i = 0; i < $scope.pastCharities.length; i++) {
        console.log('$scope.pastCharities[' + i + '].id: ' + $scope.pastCharities[i].id);
        if (charityId == $scope.pastCharities[i].id) {
          $scope.selectedCharityDisplay.totalMoneyRaised = $scope.pastCharities[i].moneyRaised;
        }
      }
    };
    // $scope.updateMoneyRaised();


    //TODO: QUERY MONTH OF RUNS TO GET MONTH MONEY RAISED




    console.log($rootScope.getUserId());

    console.log('$scope.selectedCharityDisplay.totalMoneyRaised: '+ $scope.selectedCharityDisplay.totalMoneyRaised);
    console.log('charityId for post: ' + charityId);


      UserAPI.setSelectedCharity(userId,
        {charityId: charityId, moneyRaised: moneyRaised})
        .success(function (data, status, headers, config) {
          console.log('UserAPI setSelectedCharity call succeeded');
          console.log('moneyRaised: ' + moneyRaised);
          $scope.getDisplayInformation = function(){
            CharityAPI.getById(charityId)
              .success(function (data, status, headers, config) {
                console.log('CharityAPI get by id succeeded');
                console.log('data.charity.name: ' + data.name);
                console.log('data.charity.description: ' + data.description);
                $rootScope.setSelectedCharityName(data.name);
                $rootScope.setSelectedCharityDescription(data.description);
                $rootScope.setSelectedCharityUrl(data.url);
                $rootScope.setSelectedCharityId(data._id);
                $rootScope.setSelectedCharityMoneyRaised(moneyRaised);
                $scope.selectedCharityDisplay.name = data.name;
                $scope.selectedCharityDisplay.description = data.description;
                $scope.selectedCharityDisplay.url = data.url;
                $scope.selectedCharityDisplay.avatar = data.avatar;
                $scope.selectedCharityDisplay.totalMoneyRaised = moneyRaised;

                console.log('oldSelectedCharityId: ' + $scope.oldSelectedCharityId);
                console.log('new (getSelected) CharityId: ' + $rootScope.getSelectedCharityId());
                $scope.setSelected($scope.oldSelectedCharityId, $rootScope.getSelectedCharityId());

                CharityAPI.updateCharityName($rootScope.getUserId(), data.name)
                  .success(function(data, status, headers, config){
                    console.log('updateCharityName succeeded: ' + data.charityName);
                  })
                  .error(function(err, status){
                    console.log('updateCharityName failed with error: ' + err + ' and status: ' + status);
                  });


                console.log('charityId from inside setSelectedCharity success call: ' + charityId);
                $scope.getMonthMoneyRaised(charityId);

              })
              .error(function (err, status) {
                console.log('CharityAPI get by id failed with error: ' + err + ' and status: ' + status);
              })
          }
          $scope.getDisplayInformation();


        })
        .error(function (err, status) {
          console.log('UserAPI setSelectedCharity call failed with error: ' + err + ' and status: ' + status);
        });



    console.log('$rootScope.getSelectedCharityId(): ' + $rootScope.getSelectedCharityId());
    console.log('charityMonth: ' + $scope.charityMonth);



    console.log('$scope.objectIds: ' + JSON.stringify($scope.objectIds));
    console.log('$scope.objectIds: ' + JSON.stringify($scope.pastCharities));
    console.log('$scope.objectIds.length: ' + $scope.objectIds.length);
    // $scope.getObjectId = function(){
    //   if($scope.pastCharities.length> 0){
    //     for(var i=0; i< $scope.pastCharities.length; i++){
    //       console.log('pastCharities['+i+']._id: ' + $scope.pastCharities[i]._id);
    //       console.log('pastCharities['+i+'].id:' + $scope.pastCharities[i].id);
    //       if($scope.pastCharities[i].id == $rootScope.getSelectedCharityId()){
    //         $scope.objId = $scope.pastCharities[i]._id;
    //         console.log('$scope.objId: ' + $scope.objId);
    //         $scope.updatePastCharities();
    //       }
    //     }
    //   } else {
    //     console.log('pastCharities.length was less than one');
    //     $scope.setSelectedCharity();
    //   }
    //
    // }
    //
    // $scope.getObjectId();



  }

  //Get selected charity in list to expand
  $scope.toggledCharity;
  $scope.showCharity = false;
  $scope.toggleListDetail = function(charityId) {
    $scope.toggledCharity = charityId;
    $scope.showCharity = !$scope.showCharity;
    console.log($scope.showCharity);

  }

  $scope.detailListShow = function(thisCharityId, toggleCharityId) {
    if ((thisCharityId == toggleCharityId) && ($scope.showCharity)){
      return true;
    }
  }
  });

  $rootScope.$broadcast('fetchCharities');


});
