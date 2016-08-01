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

          var myLatLng = navigator.geolocation.getCurrentPosition(function(pos){
            console.log('Centering on position on map initilization');
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

          }, function(error){
            alert('Unable to get current location' + error.message);
          });


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
  .directive('linearChart', function($window){
    return{
      restrict:'EA',
      template:"<svg width='850' height='200'></svg>",
      link: function(scope, elem, attrs){
        var salesDataToPlot=scope[attrs.chartData];
        var padding = 20;
        var pathClass="path";
        var xScale, yScale, xAxisGen, yAxisGen, lineFun;

        var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        var svg = d3.select(rawSvg[0]);

        function setChartParameters(){

          xScale = d3.scale.linear()
            .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
            .range([padding + 5, rawSvg.attr("width") - padding]);

          yScale = d3.scale.linear()
            .domain([0, d3.max(salesDataToPlot, function (d) {
              return d.sales;
            })])
            .range([rawSvg.attr("height") - padding, 0]);

          xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(salesDataToPlot.length - 1);

          yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

          lineFun = d3.svg.line()
            .x(function (d) {
              return xScale(d.hour);
            })
            .y(function (d) {
              return yScale(d.sales);
            })
            .interpolate("basis");
        }

        function drawLineChart() {

          setChartParameters();

          svg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,180)")
            .call(xAxisGen);

          svg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(20,0)")
            .call(yAxisGen);

          svg.append("svg:path")
            .attr({
              d: lineFun(salesDataToPlot),
              "stroke": "blue",
              "stroke-width": 2,
              "fill": "none",
              "class": pathClass
            });
        }

        drawLineChart();
      }
    };
  })
  .directive('radialProgress', function($window){
    return{
      restrict:'EA',
      template:"<svg></svg>",
      link: function(scope, elem, attrs){

        var data = scope[attrs.progressData];

        var colors =  {
          'incomplete':'#ff8d00',
          'complete': '#00b9be'
        }

        var radius = 100;
        var border = 5;
        var padding = 30;
        var startPercent = 0;
        var endPercent = data;

        var twoPi = Math.PI * 2;
        // var formatPercent = d3.format('.0%');
        var boxSize = (radius + padding) * 2;

        var count = Math.abs((endPercent - startPercent) / 0.01);
        var step = endPercent < startPercent ? -0.01 : 0.01;

        var d3 = $window.d3;
        var rawSvg = elem.find("svg");
        var svg = d3.select(rawSvg);

        console.log(d3)

        var arc = d3.svg.arc()
          .startAngle(0)
          .innerRadius(radius)
          .outerRadius(radius - border);

        console.log(arc)



      }
    };
  });
