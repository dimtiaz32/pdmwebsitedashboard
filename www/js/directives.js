/**
 * Created by dev on 7/2/16.
 */


angular.module('starter.directives', [])

  .directive('map', function(){
    return{
      restrict: 'E',
      scope: {
        onCreate: '&'
      },
      link: function($scope, $element, $attr){
        $scope.initialize= function(){

          // var myLatLng = navigator.geolocation.getCurrentPosition(function(pos){
          //   console.log('Centering on position on map initilization');
          //   map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          //
          // }, function(error){
          //   alert('Unable to get current location' + error.message);
          // });


          var map = new google.maps.Map($element[0]);

          $scope.onCreate({map: map});


          google.maps.event.addDomListener($element[0], 'mousedown', function(e){
            e.preventDefault();
            return false;
          });
        }

        if(document.readyState === "complete"){
          $scope.initialize();
        } else {
          google.maps.event.addDomListener(window, 'load', $scope.initialize);
        }
      }
    }
  })

  .directive('enterClose', function() {
    return {
      link: function (scope, element, attributes) {
        element.bind('keydown', function (event) {
          if (event.which == 13) {
            console.log("Close keyboard");
            element[0].blur();
          }
        })
      }
    }
  });


