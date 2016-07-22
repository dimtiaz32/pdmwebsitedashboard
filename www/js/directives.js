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

          var myLatLng = navigator.geolocation.getCurrentPosition(function(pos){
            console.log('Centering on position on map initilization');
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

          }, function(error){
            alert('Unable to get current location' + error.message);
          });

          var mapOptions = {
            center: myLatLng,
            zoom: 19,
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
