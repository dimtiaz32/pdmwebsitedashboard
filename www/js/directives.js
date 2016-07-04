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
      function initialize(){
        var mapOptions = {
          center: new google.maps.LatLng(43.07493, -89.381288),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($element[0], mapOptions);

        $scope.onCreate({map: map});

        google.maps.event.addDomListener($element[0], 'mousedown', function(e){
          e.preventDefault();
          return false;
        });
      }

      if(document.readyState === "complete"){
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});
